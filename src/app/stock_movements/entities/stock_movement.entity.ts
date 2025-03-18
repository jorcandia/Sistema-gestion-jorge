import { Product } from "src/app/products/entities/product.entity";
import { Column, Entity, ManyToMany, ObjectId, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "stock_movements" })
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column()
  createdAt: Date;

  @Column()
  objectId: number

  @Column()
  objectModel: string;

  @ManyToMany(() => Product, (product) => product.stock_movements)
  product: Product;
}
