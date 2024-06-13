import { BagType } from "src/bag-types/entities/bag-type.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { BloodBagStatus } from "src/core/types/fieldsEnum.types";
import { DonationEvent } from "src/donation_events/entities/donation_event.entity";
import { Donation } from "src/donations/entities/donation.entity";
import { BloodInventory } from "src/inventory/entities/blood_inventory.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

@Entity('blood_bags')
export class BloodBag extends BaseEntity {
    @Column({ type: 'int' })
    bagNo: number

    @OneToOne(() => Donation, donation => donation.bloodBag, { nullable: true })
    @JoinColumn()
    donation: Donation;

    @Column({ type: 'enum', enum: BloodBagStatus, default: BloodBagStatus.USABLE })
    status: BloodBagStatus

    @ManyToOne(() => DonationEvent, donationEvent => donationEvent.bloodBags)
    donationEvent: DonationEvent

    @OneToMany(() => BloodInventory, bloodInventory => bloodInventory.bloodBag, { nullable: true })
    bloodInventory: BloodInventory[]

    @ManyToOne(() => BagType, bagType => bagType.bloodBags, { nullable: true })
    bagType: BagType
}
