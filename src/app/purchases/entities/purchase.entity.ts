import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "purchases" })
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  providerId: number;

  @Column()
  userId: number;

  @Column({ type: "decimal", precision: 10, scale: 3 })
  totalAmount: number;

  @Column()
  createdAt: Date;
}
