import { Column, Entity, ObjectId, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "account_transactions" })
export class AccountTransaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    accountId: number;

    @Column()
    amount: number;

    @Column()
    description: string;

    @Column()
    ObjectId: number;

    @Column()
    objectModel: string;
}
