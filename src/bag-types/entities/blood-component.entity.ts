import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BagType } from "./bag-type.entity";

@Entity()
export class BloodComponent extends BaseEntity {
    @Column({ type: 'varchar' })
    componentName!: string

    @Column({ type: 'int' })
    expiryInDays!: number

    @ManyToOne(() => BagType, bagType => bagType.bloodComponents)
    bagType: BagType
}