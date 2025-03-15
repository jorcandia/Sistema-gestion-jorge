import { Purchase } from "src/app/purchases/entities/purchase.entity";
import { Role } from "src/app/roles/entities/role.entity";
import { Sale } from "src/app/sales/entities/sale.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  roleId: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  authStrategy: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Sale, (sale) => sale.user)
  sales: Sale[];

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];

  @CreateDateColumn()
  createdAt: Date;

  @JoinColumn({ name: "roleId" })
  @ManyToOne((type) => Role, (role) => role.users)
  role: Role;
}
