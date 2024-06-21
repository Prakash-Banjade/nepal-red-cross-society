import { BaseEntity } from "src/core/entities/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";
import { BloodRequest } from "./blood_request.entity";
import { ServiceCharge } from "src/service-charge/entities/service-charge.entity";

@Entity()
export class BloodRequestCharge extends BaseEntity {
    @Column({ type: 'int' })
    quantity: number

    @ManyToOne(() => ServiceCharge, (serviceCharge) => serviceCharge.bloodRequestCharges)
    serviceCharge: ServiceCharge

    @ManyToOne(() => BloodRequest, (bloodRequest) => bloodRequest.bloodRequestCharges)
    bloodRequest: BloodRequest

    @Column({ type: 'int' })
    amount: number

    @BeforeInsert()
    @BeforeUpdate()
    async calculateAmount() {
        this.amount = this.quantity * this.serviceCharge.publicRate
    }
}