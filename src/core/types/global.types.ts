export enum Roles {
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    USER = 'user',
}

export interface RequestUser {
    name: string;
    userId: string;
    email: string;
    role: Roles;
}

export interface AuthUser {
    userId: string;
    name: string;
    email: string;
    role: Roles;
}

export enum Action {
    MANAGE = 'manage',
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    RESTORE = 'restore',
}

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
    BRAHMIN = 'brahmin',
    CHHETRI = 'chhetri',
    MAGAR = 'magar',
    NEWAR = 'newar',
    RAI = 'rai',
    LIMBU = 'limbu',
}

export enum Religion {
    HINDU = 'hindu',
    CHRISTIAN = 'christian',
    ISLAM = 'islam',
    BUDDHIST = 'buddhist',
    OTHER = 'other',
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
    WHOLE_BLOOD = 'whole_blood',
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