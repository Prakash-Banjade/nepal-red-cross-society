import { BloodBag } from "src/blood-bags/entities/blood-bag.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class BagType extends BaseEntity {
    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'simple-array' })
    components: string[]

    @OneToMany(() => BloodBag, (bloodBag) => bloodBag.bagType)
    bloodBags: BloodBag[]
}

