import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateProviderDto } from "./dto/create-provider.dto";
import { UpdateProviderDto } from "./dto/update-provider.dto";
import { Provider } from "./entities/provider.entity";
import { And, FindOperator, ILike, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Pagination } from "src/utils/paginate/pagination";
import { GetProviderDto } from "./dto/get-provider.dto";

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>
  ) {}

  async create(provider: CreateProviderDto) {
    const newProvider = this.providerRepository.create(provider);

    return await this.providerRepository.save(newProvider);
  }

  async findAll({ size, page, name }: GetProviderDto) {
    type findOptions = { name?: FindOperator<string> };
    const findOptions: findOptions = {};
    const nameValues: string[] = name
      ?.split(" ")
      .map((item: string) => item.trim());

    if (nameValues?.length)
      findOptions.name = And(...nameValues?.map((n) => ILike(`%${n}%`)));

    if (page && size) {
      const [results, total] = await this.providerRepository.findAndCount({
        skip: (page - 1) * size,
        take: size,
        order: { id: "DESC" },
        where: findOptions,
      });
      return new Pagination<Provider>({ results, total, page, size });
    } else {
      return this.providerRepository.find({
        order: { id: "DESC" },
        where: findOptions,
      });
    }
  }

  async findOne(id: number) {
    const providerFound = await this.providerRepository.findOneBy({ id });

    if (!providerFound) {
      throw new HttpException("provider not found", HttpStatus.NOT_FOUND);
    }
    return providerFound;
  }

  async update(id: number, provider: UpdateProviderDto) {
    const providerFound = await this.providerRepository.findOneBy({ id });

    if (!providerFound) {
      throw new HttpException("provider not found", HttpStatus.NOT_FOUND);
    }
    const updateProvider = { ...providerFound, ...provider };
    return this.providerRepository.save(updateProvider);
  }

  async remove(id: number) {
    const result = await this.providerRepository.softDelete(id);

    if (result.affected === 0) {
      throw new HttpException("provider not found", HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
