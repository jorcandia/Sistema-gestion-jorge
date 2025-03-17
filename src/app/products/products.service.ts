import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { And, FindOperator, ILike, Repository } from "typeorm";
import { GetProductDto } from "./dto/get-product.dto";
import { Pagination } from "src/utils/paginate/pagination";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async create(productDto: CreateProductDto) {
    const newProduct = this.productRepository.create(productDto);
    return await this.productRepository.save(newProduct);
  }

  async findAll({ size, page, name }: GetProductDto) {
    type findOptions = { name?: FindOperator<string> };
    const findOptions: findOptions = {};
    const nameValues: string[] = name
      ?.split(" ")
      .map((item: string) => item.trim());

    if (nameValues?.length)
      findOptions.name = And(...nameValues?.map((n) => ILike(`%${n}%`)));

    if (page && size) {
      const [results, total] = await this.productRepository.findAndCount({
        skip: (page - 1) * size,
        take: size,
        order: { id: "DESC" },
        where: findOptions,
      });
      return new Pagination<Product>({ results, total, page, size });
    } else {
      return this.productRepository.find({
        order: { id: "DESC" },
        where: findOptions,
      });
    }
  }

  async findOne(id: number) {
    const productFound = await this.productRepository.findOneBy({ id });
    if (!productFound) {
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
    }
    return productFound;
  }

  async update(id: number, product: UpdateProductDto) {
    const productFound = await this.productRepository.findOneBy({ id });
    if (!productFound) {
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
    }
    const updateProduct = { ...productFound, ...product };
    return this.productRepository.save(updateProduct);
  }

  async remove(id: number) {
    const result = await this.productRepository.softDelete(id);
    if (result.affected === 0) {
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
