import { Donor } from "src/donors/entities/donor.entity";
import { BaseEntity } from "src/entities/base.entity";
import { District, Province } from "src/types/address.types";
import { Municipal } from "src/types/municipals.types";
import { Column, Entity, OneToOne } from "typeorm";

@Entity()
export class Address extends BaseEntity {
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

    @OneToOne(() => Donor, (donor) => donor.address)
    donor: Donor
}
