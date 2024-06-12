import { BloodRequestCharge } from "src/blood_request/entities/blood-request-charge.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";

@Entity()
export class ServiceCharge extends BaseEntity {
    @Column({ type: 'varchar' })
    particular: string;

    @Column({ type: 'int' })
    publicRate: number;

    @OneToMany(() => BloodRequestCharge, (bloodRequestCharge) => bloodRequestCharge.serviceCharge)
    bloodRequestCharges: BloodRequestCharge[]
}
