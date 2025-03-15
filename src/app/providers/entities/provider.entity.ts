import { Product } from "src/app/products/entities/product.entity";
import { Purchase } from "src/app/purchases/entities/purchase.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "providers" })
export class Provider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Product, (product) => product.provider, { cascade: true })
  products: Product[];

  @OneToMany(() => Purchase, (purchase) => purchase.provider, { cascade: true })
  purchases: Purchase[];
}
