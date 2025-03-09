import { CashRegister } from "src/app/cash_registers/entities/cash_register.entity";
import { Client } from "src/app/clients/entities/client.entity";
import { SaleDetail } from "src/app/sale_details/entities/sale_detail.entity";
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

@Entity({ name: "sales" })
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number;

  @Column()
  userId: number;

  @Column()
  cashRegisterId: number;

  @Column({ type: "decimal", precision: 10, scale: 3 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Client, (cliente) => cliente.sales)
  @JoinColumn({ name: "clientId" })
  client: Client;

  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => CashRegister, (cashRegister) => cashRegister.sales)
  @JoinColumn({ name: "cashRegisterId" })
  cashRegister: CashRegister;

  @OneToMany(() => SaleDetail, (sale_detail) => sale_detail.sale)
  sale_detail: SaleDetail[];
}
