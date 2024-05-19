import { Address } from "src/address/entities/address.entity";
import { Donation } from "src/donations/entities/donation.entity";
import { DonorCard } from "src/donor_card/entities/donor_card.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { BloodType, Caste, Gender, Race, Religion, RhFactor } from "src/core/types/global.types";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, OneToOne } from "typeorm";
import { User } from "src/users/entities/user.entity";

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

    @OneToOne(() => User, (user) => user.donor)
    account: User

    @Column({ type: 'varchar' })
    emergencyContact: string;

    @Column({ type: 'enum', enum: Race, nullable: true })
    race: Race;

    @Column({ type: 'enum', enum: Caste })
    caste: Caste;

    @Column({ type: 'enum', enum: Religion })
    religion: Religion;

    @Column({ type: 'varchar', length: 10 })
    phone: string;

    @Column({ type: 'datetime' })
    dob: Date;

    @Column({ type: 'real' })
    weight: number;

    // circular dependency
    @OneToOne(() => Address, (address) => address.donor)
    address: Address

    @Column({ type: 'enum', enum: BloodType })
    bloodType: BloodType;

    @Column({ type: 'enum', enum: RhFactor })
    rhFactor: RhFactor;

    @Column({ type: 'varchar', nullable: true })
    image: string;

    // circular dependencies
    @OneToMany(() => Donation, (donation) => donation.donor, { nullable: true })
    donations: Donation[];

    @OneToOne(() => DonorCard, (donorCard) => donorCard.donor, { nullable: true })
    donorCard: DonorCard

    @BeforeInsert()
    @BeforeUpdate()
    checkIfEligibleForDonorCard() {
        if (this.donations?.length < 3) this.donorCard = null
    }

    @BeforeInsert()
    @BeforeUpdate()
    validateEmail() {
        if (!this.email) throw new Error('Email required');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(this.email)) throw new Error('Invalid email');
    }
}
