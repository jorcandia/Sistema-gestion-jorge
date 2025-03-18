import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "accounts" })
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  balance: number;

  @Column()
  createdAt: Date;
}
