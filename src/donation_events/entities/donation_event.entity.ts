import { Donation } from 'src/donations/entities/donation.entity';
import { BaseEntity } from 'src/entities/base.entity';
import { Volunteer } from 'src/volunteers/entities/volunteer.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class DonationEvent extends BaseEntity {
  // donations
  @OneToMany(() => Donation, (donation) => donation.donation_event)
  donations: Donation[];

  @Column({ type: 'date', nullable: false })
  date: string;

  @Column({ nullable: true })
  host: string;

  @Column()
  location: string;

  @Column()
  mapLink: string;

  @Column()
  leader: string;

  @OneToMany(() => Volunteer, (volunteer) => volunteer.donationEvent)
  volunteers: Volunteer[];
}
