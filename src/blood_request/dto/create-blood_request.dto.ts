import { BadRequestException } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { FileSystemStoredFile, IsFile } from "nestjs-form-data";
import { BloodType, Gender, RhFactor } from "src/core/types/fieldsEnum.types";

export class Charge {
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

export class CreateBloodRequestDto {
    @ApiProperty({ type: 'string', format: 'uuid' })
    @IsUUID()
    @IsNotEmpty()
    hospitalId: string;

    @ApiProperty({ type: 'string', format: 'uuid' })
    @IsUUID()
    patientId: string;

    @ApiPropertyOptional({ type: String })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    ward: string;

    @ApiPropertyOptional({ type: 'number' })
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Bed number must be a number');
        return parseInt(value);
    })
    @IsOptional()
    bedNo?: number;

    @ApiPropertyOptional({ type: String })
    @IsString()
    @IsOptional()
    disease: string

    @ApiPropertyOptional({ type: 'string' })
    @IsString()
    @IsOptional()
    attendingConsultant?: string;

    @ApiProperty({ type: String, description: 'Stringified array of service charges' })
    @IsString()
    @IsNotEmpty()
    charges: string;

    @ApiProperty({ type: String, format: 'uuid', isArray: true })
    @IsUUID('4', { each: true })
    @IsNotEmpty()
    inventoryIds: string[]

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

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    doctor?: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsFile()
    @IsOptional()
    // @HasMimeType(['image/jpeg', 'image/png'])
    documentFront: FileSystemStoredFile;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsFile()
    @IsOptional()
    // @HasMimeType(['image/jpeg', 'image/png'])
    documentBack: FileSystemStoredFile;
}
