import { Donor } from "src/donors/entities/donor.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { BeforeUpdate, Column, Entity, OneToOne } from "typeorm";

@Entity()
export class DonorCard extends BaseEntity {
    @Column({ type: 'varchar' })
    card_no: string;

    @OneToOne(() => Donor, (donor) => donor.donorCard)
    donor: Donor
}
