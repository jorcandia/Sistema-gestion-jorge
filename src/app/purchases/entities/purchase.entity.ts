import { User } from 'src/app/users/entities/user.entity'
import { Provider } from 'src/app/providers/entities/provider.entity'
import { Warehouse } from 'src/app/warehouses/entities/warehouse.entity'
import { PurchaseDetail } from 'src/app/purchase_details/entities/purchase_detail.entity'
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ name: 'purchases' })
export class Purchase {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    providerId: number

    @Column()
    userId: number

    @Column()
    wareHouseId: number

    @Column({ type: 'decimal', precision: 10, scale: 3 })
    totalAmount: number

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @OneToMany(() => PurchaseDetail, (purchaseDetail) => purchaseDetail.purchase, {
        cascade: ['insert'],
    })
    purchase_details: PurchaseDetail[]

    @ManyToOne(() => User, (user) => user.purchases)
    @JoinColumn({ name: 'userId' })
    user: User

    @ManyToOne(() => Provider, (provider) => provider.purchases)
    @JoinColumn({ name: 'providerId' })
    provider: Provider

    @ManyToOne(() => Warehouse, (warehouse) => warehouse.purchases)
    @JoinColumn({ name: 'wareHouseId' })
    warehouse: Warehouse
}
