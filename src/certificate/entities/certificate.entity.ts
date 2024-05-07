import { Donation } from "src/donations/entities/donation.entity";
import { BaseEntity } from "src/entities/base.entity";
import { Column, Entity, OneToOne } from "typeorm";

@Entity()
export class Certificate extends BaseEntity {
    @Column()
    certificateId: number;

    @OneToOne(() => Donation, (donation) => donation.certificate)
    donation: Donation;
}
