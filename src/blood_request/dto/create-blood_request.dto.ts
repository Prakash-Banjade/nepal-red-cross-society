import { BadRequestException } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile } from "nestjs-form-data";
import { BloodItems, BloodType, Gender, RhFactor } from "src/core/types/fieldsEnum.types";

class Charge {
    @ApiProperty({ type: Number })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Quantity must be a number');
        return parseInt(value);
    })
    quantity!: number

    @ApiProperty({ type: 'string', format: 'uuid' })
    @IsUUID()
    @IsNotEmpty()
    serviceCharge!: string

    constructor({ quantity, serviceCharge }: { quantity: number, serviceCharge: string }) {
        this.quantity = quantity;
        this.serviceCharge = serviceCharge;
    }
}

class RequestedComponents {
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    componentName: string

    @ApiProperty({ type: 'number' })
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Quantity must be a number');
        return parseInt(value);
    })
    @IsNotEmpty()
    quantity: number

    constructor({ componentName, quantity }: { componentName: string, quantity: number }) {
        this.componentName = componentName;
        this.quantity = quantity;
    }
}

export class CreateBloodRequestDto {
    @ApiProperty({ type: 'string', format: 'uuid' })
    @IsUUID()
    @IsNotEmpty()
    hospitalId: string;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    patientName: string;

    @ApiProperty({ type: Number })
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Patient Age must be a number');
        return parseInt(value);
    })
    @IsNotEmpty()
    @IsNotEmpty()
    patientAge: number;

    @ApiProperty({ type: 'enum', enum: Gender })
    @IsEnum(Gender)
    patientGender: Gender;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    inpatientNo: string;

    @ApiProperty({ type: 'number' })
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Ward must be a number');
        return parseInt(value);
    })
    @IsNotEmpty()
    @IsNotEmpty()
    ward: number;

    @ApiPropertyOptional({ type: 'number' })
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Bed number must be a number');
        return parseInt(value);
    })
    @IsNotEmpty()
    @IsNotEmpty()
    @IsOptional()
    bedNo?: number;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    attendingConsultant?: string;

    @ApiProperty({ isArray: true, description: 'Array of service charges' })
    @IsDefined()
    @Transform(({ value }) => {
        try {
            const array = JSON.parse(value)
            return array.map((charge: { quantity: number, serviceCharge: string }) => new Charge(charge))

        } catch (e) {
            throw new BadRequestException('Invalid service charge');
        }
    })
    @Type(() => Charge)
    charges: Charge[]

    @ApiProperty({ isArray: true, description: 'Array of requested bloods' })
    @IsDefined()
    @Transform(({ value }) => {
        try {
            const array = JSON.parse(value)
            return array.map((component: { componentName: string, quantity: number }) => new RequestedComponents(component))
        } catch (e) {
            throw new BadRequestException('Invalid blood component type');
        }
    })
    @Type(() => RequestedComponents)
    requestedComponents: RequestedComponents[]

    @ApiProperty({ type: 'enum', enum: BloodType, description: 'Blood type' })
    @IsEnum(BloodType, { message: 'Invalid blood type. Blood type must be either ' + Object.values(BloodType).join(', ') })
    bloodType!: BloodType;

    @ApiProperty({ type: 'enum', enum: RhFactor, description: 'Blood RH-factor' })
    @IsEnum(RhFactor, { message: 'Invalid rh factor. Rh factor must be either ' + Object.values(RhFactor).join(', ') })
    rhFactor!: RhFactor;

    @ApiProperty({ type: 'number' })
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Price must be a number')
        return parseInt(value)
    })
    price!: number

    @ApiPropertyOptional({ type: 'int' })
    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    previouslyTransfused?: number;

    @ApiProperty({ type: 'boolean', default: false })
    @Transform(({ value }) => value === 'true')
    @IsNotEmpty()
    reactionToPreviousBlood: boolean

    @ApiProperty({ type: 'boolean', default: false })
    @Transform(({ value }) => value === 'true')
    @IsNotEmpty()
    reactionToPreviousPlasma: boolean

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    doctor?: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsFile()
    // @HasMimeType(['image/jpeg', 'image/png'])
    documentFront: FileSystemStoredFile;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsFile()
    // @HasMimeType(['image/jpeg', 'image/png'])
    documentBack: FileSystemStoredFile;
}
