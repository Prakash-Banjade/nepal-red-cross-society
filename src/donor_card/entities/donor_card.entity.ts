import { Donor } from "src/donors/entities/donor.entity";
import { BaseEntity } from "src/entities/base.entity";
import { Column, Entity, OneToOne } from "typeorm";

@Entity()
export class DonorCard extends BaseEntity {
    @Column({ type: 'varchar' })
    card_no: string;

    @OneToOne(() => Donor, (donor) => donor.donorCard)
    donor: Donor
}
