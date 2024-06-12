import { Donor } from "src/donors/entities/donor.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { Organization } from "src/organizations/entities/organization.entity";
import { addresses } from "src/core/types/address.types";
import { Country } from "src/core/types/country.types";
import { Municipal } from "src/core/types/municipals.types";
import { Technician } from "src/technicians/entities/technician.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BadRequestException } from "@nestjs/common";
import { DonationEvent } from "src/donation_events/entities/donation_event.entity";
import { Province } from "src/core/types/provinces.types";
import { District } from "src/core/types/districts.types";
import { Hospital } from "src/hospitals/entities/hospital.entity";

@Entity()
export class Address extends BaseEntity {
    @Column({ type: 'enum', enum: Country })
    country: Country;

    @Column({ type: 'varchar', nullable: true })
    province: Province;

    @Column({ type: 'varchar', nullable: true })
    district: District;

    @Column({ type: 'varchar', nullable: true })
    municipality: Municipal;

    @Column({ type: 'int', nullable: true })
    ward: number;

    @Column({ type: 'varchar' })
    street: string;

    @OneToOne(() => Donor, (donor) => donor.address, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn()
    donor: Donor

    @OneToOne(() => Technician, (technician) => technician.address, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn()
    technician: Technician

    @OneToOne(() => Organization, (organization) => organization.address, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn()
    organization: Organization

    @OneToOne(() => DonationEvent, (donationEvent) => donationEvent.address, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn()
    donationEvent: DonationEvent

    @OneToOne(() => Hospital, (hospital) => hospital.address, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn()
    hospital: Hospital

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
