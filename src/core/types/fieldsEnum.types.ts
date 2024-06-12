export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum Race {
    NONE = 'none',
    MAHILA = 'mahila',
    JANAJATI = 'janajati',
    ADIWASHI = 'adiwashi',
    DALIT = 'dalit',
}

export enum BloodType {
    A = 'A',
    B = 'B',
    AB = 'AB',
    O = 'O',
}

export enum RhFactor {
    POSITIVE = 'positive',
    NEGATIVE = 'negative',
}

export enum TestCaseStatus {
    PASS = 'pass',
    FAIL = 'fail',
}

export enum Caste {
    BRAHMIN = "brahmin",
    CHHETRI = "chhetri",
    THAKURI = "thakuri",
    THARU = "tharu",
    MAGAR = "magar",
    GURUNG = "gurung",
    TAMANG = "tamang",
    KAMI = "kami",
    MUSLIM = "muslim",
    NEWAR = "newar",
    YADAV = "yadav",
    RAI = "rai",
    DAMAI = "damai",
    SARKI = "sarki",
    LIMBU = "limbu",
    OTHER = "Other",
}

export enum Religion {
    HINDU = "hindu",
    CHRISTIAN = "christian",
    ISLAM = "islam",
    BUDDHIST = "buddhist",
    KIRAT = "kirat",
    OTHER = "other",
}

export enum DonationType {
    INDIVIDUAL = 'individual',
    ORGANIZATION = 'organization',
}

export enum DonationStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
}

export enum EventStatus {
    POSTPONED = 'postponed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
    UPCOMING = 'upcoming',
    ONGOING = 'ongoing',
}

export enum BloodBagStatus {
    USED = 'used',
    USABLE = 'usable',
    WASTAGE = 'wastage',
}

export enum InventoryTransaction {
    ISSUED = 'issued',
    RECEIVED = 'received',
    TRANSFORMED = 'transformed',
}

export enum Education {
    NONE = 'none',
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    SEE = 'see',
    TWELVE = '+2',
    BACHELOR = 'bachelor',
    DIPLOMA = 'diploma',
    MASTER = 'master',
}

export enum BloodItems {
    FRESH_BLOOD = 'fresh_blood',
    PACKED_BLOOD = 'packed_blood',
    PRP = 'prp',
    CRAYO = 'crayo',
    FFP = 'ffp',
    PLATELETS = 'platelets',
    WASHED_RED_CELLS = 'washed_red_cells',
}

export enum BloodInventoryStatus {
    USABLE = 'usable',
    WASTE = 'waste',
    EXPIRED = 'expired',
    UNVERIFIED = 'unverified',
}