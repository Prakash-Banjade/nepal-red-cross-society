import { BloodBag } from "src/blood-bags/entities/blood-bag.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { Entity, ManyToOne } from "typeorm";
import { BloodRequest } from "./blood_request.entity";

@Entity()
export class RequestedBloodBag extends BaseEntity {
    @ManyToOne(() => BloodBag, (bloodBag) => bloodBag.requestedBloodBags)
    bloodBag: BloodBag

    @ManyToOne(() => BloodRequest, (bloodRequest) => bloodRequest.requestedBloodBags)
    bloodRequest: BloodRequest
}