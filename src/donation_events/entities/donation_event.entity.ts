import { Donation } from 'src/donations/entities/donation.entity';
import { BaseEntity } from 'src/core/entities/base.entity';
import { Technician } from 'src/technicians/entities/technician.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Address } from 'src/address/entities/address.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { EventStatus } from 'src/core/types/fieldsEnum.types';

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
  contactPerson: string;

  @Column({ type: 'varchar' })
  primaryContact: string;

  @Column({ type: 'varchar' })
  secondaryContact: string;

  @Column({ type: 'int' })
  expectedDonations: number;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.UPCOMING })
  status: EventStatus = EventStatus.UPCOMING;

  @OneToMany(() => Technician, (technician) => technician.donationEvent, { nullable: true })
  technicians: Technician[];

  @Column({ type: 'simple-array', nullable: true })
  gallery: string[]

  @Column({ type: 'varchar', nullable: true })
  coverImage: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar' })
  document: string;
}