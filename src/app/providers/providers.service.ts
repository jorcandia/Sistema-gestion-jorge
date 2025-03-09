import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateProviderDto } from "./dto/create-provider.dto";
import { UpdateProviderDto } from "./dto/update-provider.dto";
import { Provider } from "./entities/provider.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

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

  findAll() {
    return this.providerRepository.find();
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
