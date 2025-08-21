import { Product } from 'src/app/products/entities/product.entity'
import { Purchase } from 'src/app/purchases/entities/purchase.entity'
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ name: 'purchase_details' })
export class PurchaseDetail {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    purchaseId: number

    @Column()
    productId: number

    @Column()
    quantity: number

    @Column({ type: 'decimal', precision: 9, scale: 3 })
    cost: number

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @ManyToOne(() => Purchase, (purchase) => purchase.purchase_details)
    @JoinColumn({ name: 'purchaseId' })
    purchase: Purchase

    @ManyToOne(() => Product, (product) => product.purchase_details)
    @JoinColumn({ name: 'productId' })
    product: Product
}
