import { Donor } from "src/donors/entities/donor.entity";
import { BaseEntity } from "src/entities/base.entity";
import { Organization } from "src/organizations/entities/organization.entity";
import { District, Province, addresses } from "src/types/address.types";
import { Country } from "src/types/country.types";
import { Municipal } from "src/types/municipals.types";
import { Volunteer } from "src/volunteers/entities/volunteer.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from "typeorm";

@Entity()
export class Address extends BaseEntity {
    @Column({ type: 'enum', enum: Country })
    country: Country;

    @Column({ type: 'enum', enum: Province })
    province: Province;

    @Column({ type: 'enum', enum: District })
    district: District;

    @Column({ type: 'enum', enum: Municipal })
    municipality: Municipal;

    @Column({ type: 'int' })
    ward: number;

    @Column({ type: 'varchar' })
    street: string;

    @OneToOne(() => Donor, (donor) => donor.address, { nullable: true })
    donor: Donor

    @OneToOne(() => Volunteer, (volunteer) => volunteer.address, { nullable: true })
    volunteer: Volunteer

    @OneToOne(() => Organization, (organization) => organization.address, { nullable: true })
    organization: Organization


    @BeforeInsert()
    @BeforeUpdate()
    verifyAddress() {
        const municipal = addresses.find(address => address.province === this.province)?.districts.find(district => district.name === this.district)?.municipals.find(municipal => municipal === this.municipality)
        if (!municipal) throw new Error('Invalid address')
    }
}
