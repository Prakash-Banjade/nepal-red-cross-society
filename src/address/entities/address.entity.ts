import { Donor } from "src/donors/entities/donor.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { Organization } from "src/organizations/entities/organization.entity";
import { District, Province, addresses } from "src/core/types/address.types";
import { Country } from "src/core/types/country.types";
import { Municipal } from "src/core/types/municipals.types";
import { Volunteer } from "src/volunteers/entities/volunteer.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BadRequestException } from "@nestjs/common";
import { DonationEvent } from "src/donation_events/entities/donation_event.entity";

@Entity()
export class Address extends BaseEntity {
    @Column({ type: 'enum', enum: Country })
    country: Country;

    @Column({ type: 'enum', enum: Province, nullable: true })
    province: Province;

    @Column({ type: 'enum', enum: District, nullable: true })
    district: District;

    @Column({ type: 'enum', enum: Municipal, nullable: true })
    municipality: Municipal;

    @Column({ type: 'int', nullable: true })
    ward: number;

    @Column({ type: 'varchar' })
    street: string;

    @OneToOne(() => Donor, (donor) => donor.address, { nullable: true })
    @JoinColumn()
    donor: Donor

    @OneToOne(() => Volunteer, (volunteer) => volunteer.address, { nullable: true })
    @JoinColumn()
    volunteer: Volunteer

    @OneToOne(() => Organization, (organization) => organization.address, { nullable: true })
    @JoinColumn()
    organization: Organization

    @OneToOne(() => DonationEvent, (donationEvent) => donationEvent.address, { nullable: true })
    @JoinColumn()
    donationEvent: DonationEvent

    @BeforeInsert()
    @BeforeUpdate()
    verifyAddress() {
        if (this.country !== Country.NP) {
            this.province = null;
            this.district = null;
            this.municipality = null;
            this.ward = null;
            return;
        }
        // validate right address
        if (!this.province || !this.district || !this.municipality || !this.ward) throw new BadRequestException('Province, District, Municipality, Ward are required for Nepal address. Please provide all of them.');

        const municipal = addresses.find(address => address.province === this.province)?.districts.find(district => district.name === this.district)?.municipals.find(municipal => municipal === this.municipality)
        if (!municipal) throw new BadRequestException('Invalid address. The address you provided is not a valid address in Nepal.')
    }
}
