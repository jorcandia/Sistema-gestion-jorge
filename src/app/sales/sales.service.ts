import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { UpdateSaleDto } from "./dto/update-sale.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Sale } from "./entities/sale.entity";
import { Repository } from "typeorm";
import { ProductsService } from "../products/products.service";
import { CreateSaleDetailDto } from "../sale_details/dto/create-sale_detail.dto";

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private saleRepository: Repository<Sale>,
    private productService: ProductsService
  ) {}

  async create(sale: CreateSaleDto, user: any) {
    const details = await Promise.all(
      sale.sale_details.map(async (detail: CreateSaleDetailDto) => {
        if (detail.price) {
          return detail;
        } else {
          const product = await this.productService.findOne(detail.productId);
          if (!product) {
            throw new Error(
              `Producto con ID ${detail.productId} no encontrado`
            );
          }
          return { ...detail, price: Number(product.price) };
        }
      })
    );
    const totalAmount = details.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.price * currentValue.quantity,
      0
    );
    const newRecord = this.saleRepository.create({
      ...sale,
      sale_details: details,
      totalAmount,
      userId: user.id,
    });
    console.log(user);
    return await this.saleRepository.save(newRecord);
  }

  async findAll() {
    return await this.saleRepository.find();
  }

  async findOne(id: number) {
    const recordFound = await this.saleRepository.findOneBy({ id });

    if (!recordFound) {
      throw new HttpException("sale not found", HttpStatus.NOT_FOUND);
    }
    return recordFound;
  }

  async update(id: number, sale: UpdateSaleDto) {
    const recordFound = await this.saleRepository.findOneBy({ id });

    if (!recordFound) {
      throw new HttpException("sale not found", HttpStatus.NOT_FOUND);
    }
    const newRecord = { ...recordFound, ...sale };
    return this.saleRepository.save(newRecord);
  }

  async remove(id: number) {
    const result = await this.saleRepository.delete({ id });

    if (result.affected === 0) {
      throw new HttpException("sale not found", HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
