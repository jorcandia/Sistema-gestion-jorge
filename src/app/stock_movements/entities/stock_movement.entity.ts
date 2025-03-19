import { Product } from 'src/app/products/entities/product.entity'
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'stock_movements' })
export class StockMovement {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    wareHouseDetailId: number

    @Column()
    quantity: number

    @CreateDateColumn()
    createdAt: Date

    @Column()
    objectId: number

    @Column()
    objectModel: string

    @ManyToMany(() => Product, (product) => product.stock_movements)
    product: Product
}
