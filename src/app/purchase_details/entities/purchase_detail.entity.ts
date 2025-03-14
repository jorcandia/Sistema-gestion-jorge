import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "purchase_details" })
export class PurchaseDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  purchseId: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column({ type: "decimal", precision: 9, scale: 3 })
  cost: number;
}
