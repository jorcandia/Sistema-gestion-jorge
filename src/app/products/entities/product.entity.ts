import { Category } from "src/app/categories/entities/category.entity";
import { Provider } from "src/app/providers/entities/provider.entity";
import { PurchaseDetail } from "src/app/purchase_details/entities/purchase_detail.entity";
import { SaleDetail } from "src/app/sale_details/entities/sale_detail.entity";
import { StockMovement } from "src/app/stock_movements/entities/stock_movement.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  providerId: number;

  @Column({ type: "decimal", precision: 9, scale: 3 })
  price: number;

  @Column({ type: "decimal", precision: 10, scale: 3 })
  cost: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Category, (category) => category.products, {
    cascade: ["insert"],
  })
  @JoinTable({
    name: "categories_per_products",
    joinColumn: { name: "productId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "categoryId", referencedColumnName: "id" },
  })
  categories: Category[];

  @ManyToOne(() => Provider, (provider) => provider.products)
  @JoinColumn({ name: "providerId" })
  provider: Provider;

  @OneToMany(() => SaleDetail, (sale_detail) => sale_detail.product)
  sale_details: SaleDetail[];

  @OneToMany(() => PurchaseDetail, (purchase_detail) => purchase_detail.product)
  purchase_details: PurchaseDetail[];

  @OneToMany(() => StockMovement, (stock_movement) => stock_movement.product)
  stock_movements: StockMovement[];
}
