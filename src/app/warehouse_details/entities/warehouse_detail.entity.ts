import { Product } from 'src/app/products/entities/product.entity'
import { Warehouse } from 'src/app/warehouses/entities/warehouse.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'warehouse_details' })
export class WarehouseDetail {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    warehouseId: number

    @Column()
    productId: number

    @Column()
    quantity: number

    @ManyToOne(() => Product, (product) => product.warehouseDetails)
    @JoinColumn({ name: 'productId' })
    product: Product

    @ManyToOne(() => Warehouse, (warehouse) => warehouse.warehouseDetails)
    @JoinColumn({ name: 'warehouseId' })
    warehouse: Warehouse
}
