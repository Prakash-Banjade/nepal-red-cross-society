import { BaseEntity } from "src/core/entities/base.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, Unique } from "typeorm";

@Entity()
export class Branch extends BaseEntity {
    @Column({ type: 'varchar' })
    name: string;

    @OneToMany(() => User, user => user.branch)
    users: User[]
}
