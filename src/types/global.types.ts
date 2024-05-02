export enum Roles {
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    USER = 'user',
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
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum Race {
    MAHILA = 'mahila',
    JANAJATI = 'janajati',
    ADIWASHI = 'adiwashi',
    DALIT = 'dalit',
}

export enum BloodGroup {
    A_POSITIVE = 'A+',
    A_NEGATIVE = 'A-',
    B_POSITIVE = 'B+',
    B_NEGATIVE = 'B-',
    O_POSITIVE = 'O+',
    O_NEGATIVE = 'O-',
    AB_POSITIVE = 'AB+',
    AB_NEGATIVE = 'AB-',
}

export enum Cast {
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
    SUCCESS = 'success',
    FAILED = 'failed',
}