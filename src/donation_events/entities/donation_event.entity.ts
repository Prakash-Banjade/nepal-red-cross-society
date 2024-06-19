import { Donation } from 'src/donations/entities/donation.entity';
import { BaseEntity } from 'src/core/entities/base.entity';
import { Technician } from 'src/technicians/entities/technician.entity';
import { BeforeUpdate, Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Address } from 'src/address/entities/address.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { EventStatus } from 'src/core/types/fieldsEnum.types';
import { BadRequestException } from '@nestjs/common';
import { BloodBag } from 'src/blood-bags/entities/blood-bag.entity';

@Entity()
export class DonationEvent extends BaseEntity {
  @Column('varchar')
  name: string;

  @OneToMany(() => Donation, (donation) => donation.donation_event, { nullable: true })
  donations: Donation[];

  @Column({ type: 'datetime', nullable: false })
  startDate: string;

  @Column({ type: 'datetime' })
  endDate: string;

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

  @Column({ type: 'longtext', nullable: true })
  inventoryItems?: string; // stringified json array: [{bagType: string, quantity: number}, {item: string, quantity: number}] 

  @Column({ type: 'simple-array', nullable: true })
  assignedBloodBags: string[]

  @OneToMany(() => BloodBag, (bloodBag) => bloodBag.donationEvent, { nullable: true })
  bloodBags: BloodBag[];

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

  @BeforeUpdate()
  checkIfDonationCompleted() {
    if (this.status === EventStatus.COMPLETED) {
      if (!this.donations?.length) throw new BadRequestException('Donation event must have atleast one donation');
      if (new Date(this.startDate) > new Date()) throw new BadRequestException('There is still time to complete this donation event');
    }

    if (this.status === EventStatus.ONGOING && new Date(this.startDate).toLocaleDateString() !== new Date().toLocaleDateString()) throw new BadRequestException('Donation event must happen on the same day');
  }
}