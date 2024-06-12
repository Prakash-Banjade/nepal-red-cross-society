import { Address } from "src/address/entities/address.entity";
import { BloodRequest } from "src/blood_request/entities/blood_request.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";

@Entity()
export class Hospital extends BaseEntity {
    @Column({ type: 'text' })
    name!: string;

    @OneToOne(() => Address, address => address.hospital)
    address: Address

    @Column({ type: 'text' })
    primaryContact!: string

    @Column({ type: 'text', nullable: true })
    secondaryContact?: string

    @OneToMany(() => BloodRequest, bloodRequest => bloodRequest.hospital, { nullable: true })
    bloodRequests: BloodRequest[]
}
