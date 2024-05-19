import { Donation } from 'src/donations/entities/donation.entity';
import { BaseEntity } from 'src/core/entities/base.entity';
import { Volunteer } from 'src/volunteers/entities/volunteer.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Address } from 'src/address/entities/address.entity';
import { Organization } from 'src/organizations/entities/organization.entity';

@Entity()
export class DonationEvent extends BaseEntity {
  @Column('varchar')
  name: string;
  
  @OneToMany(() => Donation, (donation) => donation.donation_event, { nullable: true })
  donations: Donation[];

  @Column({ type: 'datetime', nullable: false })
  date: string;

  @ManyToOne(() => Organization, (organization) => organization.donationEvents, { nullable: true })
  organization: Organization;

  @OneToOne(() => Address, (address) => address.donationEvent)
  address: Address;

  @Column()
  mapLink: string;

  @Column()
  leader: string;

  @OneToMany(() => Volunteer, (volunteer) => volunteer.donationEvent, { nullable: true })
  volunteers: Volunteer[];

  @Column({ type: 'simple-array', nullable: true })
  gallery: string[]

  @Column({ type: 'varchar', nullable: true })
  coverImage: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}