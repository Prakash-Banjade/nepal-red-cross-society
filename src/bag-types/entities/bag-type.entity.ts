import { BloodBag } from "src/blood-bags/entities/blood-bag.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { BloodComponent } from "./blood-component.entity";

@Entity()
export class BagType extends BaseEntity {
    @Column({ type: 'text' })
    name: string;

    @OneToMany(() => BloodComponent, (component) => component.bagType, { nullable: true })
    bloodComponents: BloodComponent[]

    @OneToMany(() => BloodBag, (bloodBag) => bloodBag.bagType, { nullable: true })
    bloodBags: BloodBag[]
}

