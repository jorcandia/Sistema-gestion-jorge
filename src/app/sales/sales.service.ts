import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { UpdateSaleDto } from "./dto/update-sale.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Sale } from "./entities/sale.entity";
import {
  And,
  FindOperator,
  FindOptionsWhere,
  ILike,
  In,
  Repository,
} from "typeorm";
import { ProductsService } from "../products/products.service";
import { CreateSaleDetailDto } from "../sale_details/dto/create-sale_detail.dto";
import { Pagination } from "src/utils/paginate/pagination";
import { GetSalesDto } from "./dto/get-sale.dto";
import { Client } from "../clients/entities/client.entity";

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private saleRepository: Repository<Sale>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
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
    return await this.saleRepository.save(newRecord);
  }

  async findAll({ size, page, clientName }: GetSalesDto) {
    type findOptions = { clientId?: FindOperator<number> };
    const findOptions: findOptions = {};

    if (clientName) {
      const nameValues: string[] = clientName
        .split(" ")
        .map((item) => item.trim());

      let clients: Client[] = [];

      if (nameValues.length === 1) {
        clients = await this.clientRepository.find({
          where: [
            { firstname: ILike(`%${nameValues[0]}%`) },
            { lastname: ILike(`%${nameValues[0]}%`) },
          ],
        });
      } else if (nameValues.length === 2) {
        clients = await this.clientRepository.find({
          where: [
            { firstname: ILike(`%${clientName}%`) },
            {
              firstname: ILike(`%${nameValues[0]}%`),
              lastname: ILike(`%${nameValues[1]}%`),
            },
          ],
        });
      } else {
        const firstName = nameValues[0];
        const lastName = nameValues.slice(1).join(" ");

        clients = await this.clientRepository.find({
          where: [
            { firstname: ILike(`%${clientName}%`) },
            {
              firstname: ILike(`%${firstName}%`),
              lastname: ILike(`%${lastName}%`),
            },
          ],
        });
      }

      const clientIds = clients.map((client) => client.id);
      findOptions.clientId = In(clientIds);
    }

    if (page && size) {
      const [results, total] = await this.saleRepository.findAndCount({
        skip: (page - 1) * size,
        take: size,
        order: { createdAt: "DESC" },
        where: findOptions,
      });
      return new Pagination<Sale>({ results, total, page, size });
    } else {
      return this.saleRepository.find({
        order: { createdAt: "DESC" },
        where: findOptions,
      });
    }
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
