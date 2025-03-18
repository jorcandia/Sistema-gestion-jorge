import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "warehouse_details" })
export class WarehouseDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  warehouseId: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;
}
