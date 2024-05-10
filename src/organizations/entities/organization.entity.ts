import { Address } from "src/address/entities/address.entity";
import { Donation } from "src/donations/entities/donation.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { DonationEvent } from "src/donation_events/entities/donation_event.entity";

@Entity()
export class Organization extends BaseEntity {
    @Column({ type: 'varchar' })
    name: string;

    @OneToMany(() => Donation, (donation) => donation.organization, { nullable: true })
    donations: Donation[];

    @OneToOne(() => Address, (address) => address.organization)
    address: Address

    @Column({ type: 'varchar' })
    contact: string;

    @Column({ type: 'varchar' })
    owner: string;

    @Column({ type: 'varchar' })
    representativeContact: string;

    @OneToMany(() => DonationEvent, (donationEvent) => donationEvent.organization, { nullable: true })
    donationEvents: DonationEvent[]
}
