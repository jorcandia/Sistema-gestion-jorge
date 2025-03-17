import { FindOperator, ILike, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { User } from "src/app/users/entities/user.entity";
import { CreateUserDto } from "src/app/users/dto/create-user.dto";
import { UpdateUserDto } from "src/app/users/dto/update-user.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { GetUserDto } from "./dto/get-user.dto";
import { Pagination } from "src/utils/paginate/pagination";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const foundRecord = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (foundRecord) {
      throw new HttpException("User already exists", HttpStatus.CONFLICT);
    }
    const newRecord = this.userRepository.create(createUserDto);
    return this.userRepository.save(newRecord);
  }

  async findAll({ size, page, email }: GetUserDto) {
    type findOptions = { email?: FindOperator<string> };
    const findOptions: findOptions = {};

    if (email) findOptions.email = ILike(`%${email}%`);

    if (page && size) {
      const [results, total] = await this.userRepository.findAndCount({
        skip: (page - 1) * size,
        take: size,
        order: { id: "DESC" },
        where: findOptions,
      });
      return new Pagination<User>({ results, total, page, size });
    } else {
      return this.userRepository.find({
        order: { id: "DESC" },
        where: findOptions,
      });
    }
  }

  async findOne(id: number) {
    const foundRecord = await this.userRepository.findOne({
      where: { id },
      relations: ["role"],
    });
    if (!foundRecord) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return foundRecord;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const foundRecord = await this.userRepository.findOne({ where: { id } });
    if (!foundRecord) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    const updatedRecord = Object.assign(foundRecord, updateUserDto);
    return this.userRepository.save(updatedRecord);
  }

  async remove(id: number) {
    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return result;
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ["role"],
    });
  }
}
