import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { And, FindOperator, ILike, Repository } from "typeorm";
import { Pagination } from "src/utils/paginate/pagination";
import { GetCategotyDto } from "./dto/get-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async create(category: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(category);

    return await this.categoryRepository.save(newCategory);
  }

  async findAll({ size, page, name }: GetCategotyDto) {
    type findOptions = { name?: FindOperator<string> };
    const findOptions: findOptions = {};
    const nameValues: string[] = name
      ?.split(" ")
      .map((item: string) => item.trim());

    if (nameValues?.length)
      findOptions.name = And(...nameValues?.map((n) => ILike(`%${n}%`)));

    if (page && size) {
      const [results, total] = await this.categoryRepository.findAndCount({
        skip: (page - 1) * size,
        take: size,
        order: { id: "DESC" },
        where: findOptions,
      });
      return new Pagination<Category>({ results, total, page, size });
    } else {
      return this.categoryRepository.find({
        order: { id: "DESC" },
        where: findOptions,
      });
    }
  }

  async findOne(id: number) {
    const categoryFound = await this.categoryRepository.findOneBy({ id });

    if (!categoryFound) {
      throw new HttpException("category not found", HttpStatus.NOT_FOUND);
    }
    return categoryFound;
  }

  async update(id: number, category: UpdateCategoryDto) {
    const categoryFound = await this.categoryRepository.findOneBy({ id });

    if (!categoryFound) {
      throw new HttpException("Category not found", HttpStatus.NOT_FOUND);
    }
    const updateCategory = { ...categoryFound, ...category };
    return this.categoryRepository.save(updateCategory);
  }

  async remove(id: number) {
    const result = await this.categoryRepository.softDelete(id);

    if (result.affected === 0) {
      throw new HttpException("Category not found", HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
