import { DonationEvent } from 'src/donation_events/entities/donation_event.entity';
import { BaseEntity } from 'src/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Volunteer extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  role: string;

  @ManyToOne(() => DonationEvent, (donationEvent) => donationEvent.volunteers, {
    nullable: true,
  })
  donationEvent: DonationEvent;
}
