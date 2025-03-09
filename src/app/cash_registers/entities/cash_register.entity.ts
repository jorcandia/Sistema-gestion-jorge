import { Sale } from "src/app/sales/entities/sale.entity";
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum CashRegisterStatus {
  OPEN = "open",
  CLOSED = "closed",
}

@Entity({ name: "cash_registers" })
export class CashRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column({ type: "decimal", precision: 10, scale: 3 })
  amount: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({
    type: "enum",
    enum: CashRegisterStatus,
    default: CashRegisterStatus.CLOSED,
  })
  status: CashRegisterStatus;

  @OneToMany(() => Sale, (sale) => sale.cashRegister)
  sales: Sale[];
}
