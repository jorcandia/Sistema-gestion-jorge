import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "./entities/client.entity";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>
  ) {}

  async create(client: CreateClientDto) {
    const newClient = this.clientRepository.create(client);

    return await this.clientRepository.save(newClient);
  }

  findAll() {
    return this.clientRepository.find();
  }

  async findOne(id: number) {
    const clientFound = await this.clientRepository.findOneBy({ id });

    if (!clientFound) {
      throw new HttpException("Client not found", HttpStatus.NOT_FOUND);
    }
    return clientFound;
  }

  async update(id: number, client: UpdateClientDto) {
    const clientFoud = await this.clientRepository.findOneBy({ id });

    if (!clientFoud) {
      throw new HttpException("client not found", HttpStatus.NOT_FOUND);
    }

    const updateClient = { ...clientFoud, ...client };
    return this.clientRepository.save(updateClient);
  }

  async remove(id: number) {
    const result = await this.clientRepository.softDelete(id);

    if (result.affected === 0) {
      throw new HttpException("Client not found", HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
