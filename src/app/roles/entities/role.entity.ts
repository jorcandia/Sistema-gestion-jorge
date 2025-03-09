import { User } from 'src/app/users/entities/user.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'roles' })
export class Role {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    key: string

    @Column()
    name: string

    @OneToMany(type => User, user => user.role)
    users: User[]

}
