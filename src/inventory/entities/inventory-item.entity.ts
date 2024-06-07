import { BloodInventoryStatus, BloodItems } from "src/core/types/fieldsEnum.types";
import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "src/core/entities/base.entity";
import { BloodInventory } from "./blood_inventory.entity";

@Entity('inventory_items')
export class InventoryItem extends BaseEntity {
    @Column({ type: "int" })
    bloodBagNo: number;

    @Column({ type: 'enum', enum: BloodItems })
    itemType: BloodItems;

    @ManyToOne(() => BloodInventory, bloodInventory => bloodInventory.items)
    inventory: BloodInventory

    @Column({ type: 'enum', enum: BloodInventoryStatus, default: BloodInventoryStatus.UNVERIFIED })
    status: BloodInventoryStatus;

    @Column({ type: 'varchar' })
    expiresAt: string;
}