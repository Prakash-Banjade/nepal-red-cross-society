import { Address } from 'src/address/entities/address.entity';
import { DonationEvent } from 'src/donation_events/entities/donation_event.entity';
import { BaseEntity } from 'src/core/entities/base.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Education } from 'src/core/types/global.types';

@Entity()
export class Volunteer extends BaseEntity {
  @Column({ type: 'varchar', length: 30 })
  firstName: string;

  @Column({ type: 'varchar', length: 30 })
  lastName: string;

  @OneToOne(() => Address, (address) => address.volunteer)
  address: Address

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar' })
  role: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'enum', enum: Education })
  education: Education;

  @ManyToOne(() => DonationEvent, (donationEvent) => donationEvent.volunteers, {
    nullable: true,
  })
  donationEvent: DonationEvent;
}
