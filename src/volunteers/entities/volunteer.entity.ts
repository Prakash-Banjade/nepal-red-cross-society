import { Address } from 'src/address/entities/address.entity';
import { DonationEvent } from 'src/donation_events/entities/donation_event.entity';
import { BaseEntity } from 'src/core/entities/base.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class Volunteer extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @OneToOne(() => Address, (address) => address.donor)
  address: Address

  @Column({ type: 'varchar' })
  role: string;

  @ManyToOne(() => DonationEvent, (donationEvent) => donationEvent.volunteers, {
    nullable: true,
  })
  donationEvent: DonationEvent;
}
