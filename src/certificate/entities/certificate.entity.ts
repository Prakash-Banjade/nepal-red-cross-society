import { Donation } from "src/donations/entities/donation.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Certificate extends BaseEntity {
    @Column()
    certificateId: number;

    @OneToOne(() => Donation, (donation) => donation.certificate)
    @JoinColumn()
    donation: Donation;
}
