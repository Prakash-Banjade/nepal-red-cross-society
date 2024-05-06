import { Address } from "src/address/entities/address.entity";
import { Donation } from "src/donations/entities/donation.entity";
import { DonorCard } from "src/donor_card/entities/donor_card.entity";
import { BaseEntity } from "src/entities/base.entity";
import { BloodGroup, Cast, Gender, Race } from "src/types/global.types";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, OneToOne } from "typeorm";

@Entity()
export class Donor extends BaseEntity {
    @Column({ type: 'varchar', length: 30 })
    name: string;

    @Column({ type: 'enum', enum: Gender })
    gender: Gender;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'enum', enum: Race })
    race: Race;

    @Column({ type: 'enum', enum: Cast })
    cast: Cast;

    @Column({ type: 'varchar', length: 10 })
    phone: string;

    @Column({ type: 'datetime' })
    dob: string;

    // circular dependency
    @OneToOne(() => Address, (address) => address.donor)
    address: Address

    @Column({ type: 'enum', enum: BloodGroup })
    bloodGroup: BloodGroup;

    // circular dependencies
    @OneToMany(() => Donation, (donation) => donation.donor, { nullable: true })
    donations: Donation[];

    @OneToOne(() => DonorCard, (donorCard) => donorCard.donor, { nullable: true })
    donorCard: DonorCard

    @BeforeInsert()
    @BeforeUpdate()
    checkIfEligibleForDonorCard(){
        if (this.donations.length < 3) this.donorCard = null
    }
}
