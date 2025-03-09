import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";

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

  async findAll() {
    return await this.productRepository.find();
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
