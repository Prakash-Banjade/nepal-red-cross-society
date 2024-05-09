import { Address } from "src/address/entities/address.entity";
import { Donation } from "src/donations/entities/donation.entity";
import { DonorCard } from "src/donor_card/entities/donor_card.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { BloodGroup, Cast, Gender, Race } from "src/core/types/global.types";
import * as bcrypt from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, OneToOne } from "typeorm";

@Entity()
export class Donor extends BaseEntity {
    @Column({ type: 'varchar', length: 30 })
    firstName: string;

    @Column({ type: 'varchar', length: 30 })
    lastName: string;

    @Column({ type: 'enum', enum: Gender })
    gender: Gender;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: "varchar" })
    password: string;

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
    checkIfEligibleForDonorCard() {
        if (this.donations.length < 3) this.donorCard = null
    }

    @BeforeInsert()
    hashPassword() {
        if (!this.password) throw new Error('Password required');

        this.password = bcrypt.hashSync(this.password, 10);
    }

    @BeforeInsert()
    @BeforeUpdate()
    validateEmail() {
        if (!this.email) throw new Error('Email required');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(this.email)) throw new Error('Invalid email');
    }
}
