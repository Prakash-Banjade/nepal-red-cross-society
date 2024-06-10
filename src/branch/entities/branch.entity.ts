import { BaseEntity } from "src/core/entities/base.entity";
import { Inventory } from "src/inventory/entities/inventory.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, Unique } from "typeorm";

@Entity()
export class Branch extends BaseEntity {
    @Column({ type: 'varchar' })
    name: string;

    @OneToMany(() => User, user => user.branch)
    users: User[]

    @OneToMany(() => Inventory, inventory => inventory.branch, { nullable: true })
    inventories: Inventory[]
}
