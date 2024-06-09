import { BaseEntity } from "src/core/entities/base.entity";
import { Donation } from "src/donations/entities/donation.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity('blood_bags')
export class BloodBag extends BaseEntity {
    @Column({ type: 'int' })
    bagNo: number

    @OneToOne(() => Donation, donation => donation.bloodBag)
    @JoinColumn()
    donation: Donation;
}