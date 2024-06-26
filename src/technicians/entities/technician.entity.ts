import { Address } from 'src/address/entities/address.entity';
import { DonationEvent } from 'src/donation_events/entities/donation_event.entity';
import { BaseEntity } from 'src/core/entities/base.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Education, Gender } from 'src/core/types/fieldsEnum.types';

@Entity()
export class Technician extends BaseEntity {
  @Column({ type: 'varchar', length: 30 })
  firstName: string;

  @Column({ type: 'varchar', length: 30 })
  lastName: string;

  @OneToOne(() => Address, (address) => address.technician)
  address: Address

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar' })
  role: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'enum', enum: Education })
  education: Education;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @ManyToOne(() => DonationEvent, (donationEvent) => donationEvent.technicians, {
    nullable: true,
  })
  donationEvent: DonationEvent;
}
