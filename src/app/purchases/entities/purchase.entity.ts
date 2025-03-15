import { PurchaseDetail } from "src/app/purchase_details/entities/purchase_detail.entity";
import { User } from "src/app/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

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

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => PurchaseDetail,
    (purchaseDetail) => purchaseDetail.purchase,
    {
      cascade: ["insert"],
    }
  )
  purchase_details: PurchaseDetail[];

  @ManyToOne(() => User, (user) => user.purchases)
  @JoinColumn({ name: "userId" })
  user: User;
}
