import { Product } from "src/app/products/entities/product.entity";
import { Sale } from "src/app/sales/entities/sale.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "sale_details" })
export class SaleDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  saleId: number;

  @Column()
  quantity: number;

  @Column({ type: "decimal", precision: 9, scale: 3 })
  price: number;

  @ManyToOne(() => Sale, (sale) => sale.sale_detail)
  @JoinColumn({ name: "saleId" })
  sale: Sale;

  @ManyToOne(() => Product, (product) => product.sale_detail)
  @JoinColumn({ name: "productId" })
  product: Product;
}
