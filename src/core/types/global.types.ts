import { BloodType, RhFactor } from "./fieldsEnum.types";

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
    branchId: string;
    branchName: string;
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

export interface BloodInventoryCount {
    bloodType: BloodType;
    rhFactor: RhFactor;
    count: {
        [key: string]: number
    }
}

export enum ReportPeriod {
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    YEARLY = 'yearly',
}