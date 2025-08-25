import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from './entities/product.entity'
import { And, FindOperator, ILike, Repository } from 'typeorm'
import { GetProductDto } from './dto/get-product.dto'
import { Pagination } from 'src/utils/paginate/pagination'
import { StockMovementsService } from '../stock_movements/stock_movements.service'
import { WarehouseDetailsService } from '../warehouse_details/warehouse_details.service'

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private stockMovementsService: StockMovementsService,
        private warehouseDetailsService: WarehouseDetailsService
    ) {}

    async create(productDto: CreateProductDto) {
        const newProduct = this.productRepository.create(productDto)
        return await this.productRepository.save(newProduct)
    }

    async findAll({ size, page, name }: GetProductDto) {
        type findOptions = {
            name?: FindOperator<string>
        }

        const findOptions: findOptions = {}
        const nameValues: string[] = name?.split(' ').map((item: string) => item.trim())

        if (nameValues?.length) {
            findOptions.name = And(...nameValues.map((n) => ILike(`%${n}%`)))
        }

        if (page && size) {
            const [results, total] = await this.productRepository.findAndCount({
                skip: (page - 1) * size,
                take: size,
                order: { id: 'DESC' },
                where: findOptions,
                relations: ['provider', 'categories', 'warehouseDetails'],
            })

            return new Pagination<Product>({ results, total, page, size })
        } else {
            return this.productRepository.find({
                order: { id: 'DESC' },
                where: findOptions,
                relations: ['provider', 'categories', 'warehouseDetails'],
            })
        }
    }

    async findOne(id: number) {
        const productFound = await this.productRepository.findOne({
            where: { id },
            relations: ['provider', 'categories'],
        })
        if (!productFound) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND)
        }
        return productFound
    }

    async update(id: number, product: UpdateProductDto) {
        const productFound = await this.productRepository.findOne({
            where: { id },
            relations: ['provider', 'categories'],
        })
        if (!productFound) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND)
        }
        const updateProduct = { ...productFound, ...product }
        return this.productRepository.save(updateProduct)
    }

    async remove(id: number) {
        const result = await this.productRepository.softDelete(id)
        if (result.affected === 0) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND)
        }
        return result
    }
    async findByWarehouse(warehouseId: number, { size, page, name }: { size?: number; page?: number; name?: string }) {
        // Obtener todos los productos según el filtro de nombre
        let findOptions: any = {}
        if (name) {
            const nameValues: string[] = name.split(' ').map((item: string) => item.trim())
            if (nameValues.length) {
                findOptions.name = And(...nameValues.map((n) => ILike(`%${n}%`)))
            }
        }

        // Obtener productos con sus relaciones
        let products
        if (page && size) {
            // Obtener productos paginados
            const [results, total] = await this.productRepository.findAndCount({
                skip: (page - 1) * size,
                take: size,
                order: { id: 'DESC' },
                where: findOptions,
                relations: ['provider', 'categories'],
            })
            products = results

            // Obtener todos los warehouse_details para el almacén seleccionado
            const details = await this.warehouseDetailsService.findAll()
            const warehouseDetails = details.filter((d) => d.warehouseId === warehouseId)

            // Crear un mapa de producto -> stock para acceso rápido
            const stockMap = new Map()
            warehouseDetails.forEach((d) => stockMap.set(d.productId, d.quantity))

            // Agregar el stock a cada producto (0 si no existe en el almacén)
            const productsWithStock = products.map((product) => ({
                ...product,
                stock: stockMap.get(product.id) || 0,
            }))

            return new Pagination<Product>({ results: productsWithStock, total, page, size })
        } else {
            // Si no hay paginación, obtener todos los productos
            products = await this.productRepository.find({
                order: { id: 'DESC' },
                where: findOptions,
                relations: ['provider', 'categories'],
            })

            // Obtener todos los warehouse_details para el almacén seleccionado
            const details = await this.warehouseDetailsService.findAll()
            const warehouseDetails = details.filter((d) => d.warehouseId === warehouseId)

            // Crear un mapa de producto -> stock para acceso rápido
            const stockMap = new Map()
            warehouseDetails.forEach((d) => stockMap.set(d.productId, d.quantity))

            // Agregar el stock a cada producto (0 si no existe en el almacén)
            const productsWithStock = products.map((product) => ({
                ...product,
                stock: stockMap.get(product.id) || 0,
            }))

            return productsWithStock
        }
    }
}
