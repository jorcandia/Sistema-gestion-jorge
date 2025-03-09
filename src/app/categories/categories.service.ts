import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";

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

  async findAll() {
    return await this.categoryRepository.find();
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
