import { Purchase } from 'src/app/purchases/entities/purchase.entity'
import { Sale } from 'src/app/sales/entities/sale.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'warehouses' })
export class Warehouse {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    location: string

    @OneToMany(() => Sale, (sale) => sale.warehouse)
    sales: Sale[]

    @OneToMany(() => Purchase, (purchase) => purchase.warehouse)
    purchases: Purchase[]
}
