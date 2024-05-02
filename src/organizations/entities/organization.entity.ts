import { Donation } from "src/donations/entities/donation.entity";
import { BaseEntity } from "src/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Organization extends BaseEntity {
    @Column({ type: 'varchar' })
    name: string;

    @OneToMany(() => Donation, (donation) => donation.organization, { nullable: true })
    donations: Donation[];

    @Column({ type: 'varchar' })
    location: string;
}
