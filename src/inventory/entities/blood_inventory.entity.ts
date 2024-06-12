import { BaseEntity } from "src/core/entities/base.entity";
import { BloodInventoryStatus, BloodItems, BloodType, InventoryTransaction, RhFactor } from "src/core/types/fieldsEnum.types";
import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { BloodBag } from "src/blood-bags/entities/blood-bag.entity";
import { Branch } from "src/branch/entities/branch.entity";

@Entity()
export class BloodInventory extends BaseEntity {
    @Column({ type: 'enum', enum: BloodType })
    bloodType: BloodType

    @Column({ type: 'enum', enum: RhFactor })
    rhFactor: RhFactor;

    @Column({ type: 'varchar' })
    source: string;

    @Column({ type: 'varchar' })
    destination: string;

    @Column({ type: 'int' })
    price: number

    @Column({ type: 'datetime' })
    date: string;

    @Column({ type: 'enum', enum: InventoryTransaction })
    transactionType: InventoryTransaction

    @Column({ type: 'enum', enum: BloodItems })
    itemType: BloodItems

    @Column({ type: 'datetime' })
    expiry: string;

    @OneToOne(() => BloodBag, (bloodBag) => bloodBag.bloodInventory)
    bloodBag: BloodBag;

    @Column({ type: 'enum', enum: BloodInventoryStatus, default: BloodInventoryStatus.USABLE })
    status: BloodInventoryStatus

    @ManyToOne(() => Branch, (branch) => branch.bloodInventory)
    branch: Branch
}
