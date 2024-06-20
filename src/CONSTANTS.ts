import { BloodType, RhFactor } from "./core/types/fieldsEnum.types"
import { BloodInventoryCount } from "./core/types/global.types"

export const CONSTANTS = {
    DONATION_INTERVAL: 90, // days

    BLOOD_EXPIRY_INTERVAL: 35 * 24 * 60 * 60 * 1000, // days * hours * minutes * seconds * milliseconds
    BLOOD_EXPIRY_INTERVAL_IN_DAYS: 35,

    BLOOD_BAG: 'Blood Bag',
    BLOOD_BAG_KEY: 'bloodBag',
    SELF: 'SELF',
}

export const initialBloodInventoryCount: BloodInventoryCount[] = [
    {
        bloodType: BloodType.A,
        rhFactor: RhFactor.POSITIVE,
        count: {}
    },
    {
        bloodType: BloodType.A,
        rhFactor: RhFactor.NEGATIVE,
        count: {}
    },
    {
        bloodType: BloodType.B,
        rhFactor: RhFactor.POSITIVE,
        count: {}
    },
    {
        bloodType: BloodType.B,
        rhFactor: RhFactor.NEGATIVE,
        count: {}
    },
    {
        bloodType: BloodType.O,
        rhFactor: RhFactor.POSITIVE,
        count: {}
    },
    {
        bloodType: BloodType.O,
        rhFactor: RhFactor.NEGATIVE,
        count: {}
    },
    {
        bloodType: BloodType.AB,
        rhFactor: RhFactor.POSITIVE,
        count: {}
    },
    {
        bloodType: BloodType.AB,
        rhFactor: RhFactor.NEGATIVE,
        count: {}
    },
]