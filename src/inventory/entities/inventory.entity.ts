import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { InventoryItem } from "./inventory-item.entity";
import { Branch } from "src/branch/entities/branch.entity";
import { BloodBagStatus, InventoryTransaction } from "src/core/types/fieldsEnum.types";

@Entity()
export class Inventory extends BaseEntity {
    @Column({ type: 'varchar' })
    name: string;

    @OneToMany(() => InventoryItem, (inventoryItem) => inventoryItem.inventory, { nullable: true })
    items: InventoryItem[]

    @Column({ type: 'varchar', default: 'unit' })
    unit: string

    @ManyToOne(() => Branch, (branch) => branch.inventories)
    branch: Branch

    get quantity() {
        return this.items.reduce((acc, item) => {
            return item.transactionType === InventoryTransaction.ISSUED ? acc - item.quantity : acc + item.quantity
        }, 0)
    }

    get bloodBagCount() {
        const bags = {}

        this.items.forEach(item => {
            switch (item.status) {
                case BloodBagStatus.USABLE:
                    if (item.bagType in bags) {
                        if (item.transactionType === InventoryTransaction.ISSUED) {
                            bags[item.bagType] = {
                                ...bags[item.bagType],
                                // [BloodBagStatus.USABLE]: bags[item.bagType][BloodBagStatus.USABLE] ?? 0 - item.quantity
                                [BloodBagStatus.USABLE]: 1000

                            }
                        }
                        if (item.transactionType === InventoryTransaction.RECEIVED) {
                            bags[item.bagType] = {
                                ...bags[item.bagType],
                                [BloodBagStatus.USABLE]: bags[item.bagType][BloodBagStatus.USABLE] ?? 0 + item.quantity
                            }
                        }
                    } else {
                        bags[item.bagType] = {
                            [BloodBagStatus.USABLE]: item.transactionType === InventoryTransaction.ISSUED ? -item.quantity : item.quantity
                        }
                    }
                    break;
                case BloodBagStatus.USED:
                    if (item.bagType in bags) {
                        if (item.transactionType === InventoryTransaction.ISSUED) {
                            bags[item.bagType] = {
                                ...bags[item.bagType],
                                [BloodBagStatus.USED]: bags[item.bagType][BloodBagStatus.USED] ?? 0 - item.quantity
                            }
                        }
                        if (item.transactionType === InventoryTransaction.RECEIVED) {
                            bags[item.bagType] = {
                                ...bags[item.bagType],
                                [BloodBagStatus.USED]: bags[item.bagType][BloodBagStatus.USED] ?? 0 + item.quantity
                            }
                        }
                    } else {
                        bags[item.bagType] = {
                            [BloodBagStatus.USED]: item.transactionType === InventoryTransaction.ISSUED ? -item.quantity : item.quantity
                        }
                    }
                    break;
                case BloodBagStatus.WASTAGE:
                    if (item.bagType in bags) {
                        if (item.transactionType === InventoryTransaction.ISSUED) {
                            bags[item.bagType] = {
                                ...bags[item.bagType],
                                [BloodBagStatus.WASTAGE]: bags[item.bagType][BloodBagStatus.WASTAGE] ?? 0 - item.quantity
                            }
                        }
                        if (item.transactionType === InventoryTransaction.RECEIVED) {
                            bags[item.bagType] = {
                                ...bags[item.bagType],
                                [BloodBagStatus.WASTAGE]: bags[item.bagType][BloodBagStatus.WASTAGE] ?? 0 + item.quantity
                            }
                        }
                    } else {
                        bags[item.bagType] = {
                            [BloodBagStatus.WASTAGE]: item.transactionType === InventoryTransaction.ISSUED ? -item.quantity : item.quantity
                        }
                    }
                    break;
            }
        })

        // for (const quantity of Object.values(bags)) {
        //     bags.total += quantity
        // }

        return bags
    }
}
