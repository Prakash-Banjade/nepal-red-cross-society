import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { CreateBloodBagDto } from "src/blood-bags/dto/create-blood-bag.dto";
import { CONSTANTS } from "src/CONSTANTS";
import { BloodInventoryStatus, BloodItems, BloodType, InventoryTransaction, RhFactor } from "src/core/types/fieldsEnum.types";

export class CreateBloodInventoryDto extends CreateBloodBagDto {
    @ApiProperty({ type: 'enum', enum: BloodType })
    @IsEnum(BloodType)
    bloodType: BloodType

    @ApiProperty({ type: 'enum', enum: RhFactor })
    @IsEnum(RhFactor)
    rhFactor: RhFactor;

    @ApiProperty({ type: 'string', description: 'Place where item come from' })
    @IsString()
    @IsNotEmpty()
    source!: string;

    @ApiProperty({ type: 'string', description: 'Place where item go to' })
    @IsString()
    @IsNotEmpty()
    destination!: string;

    @ApiProperty({ type: 'int', default: 0 })
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Price must be a number');
        return parseInt(value);
    })
    @IsNotEmpty()
    price!: number

    @ApiProperty({ type: 'string', format: 'date-time' })
    @IsDateString()
    @IsNotEmpty()
    date!: string

    @ApiProperty({ type: 'string', description: 'Type of item', enum: InventoryTransaction })
    @IsNotEmpty()
    @IsEnum(InventoryTransaction)
    transactionType!: InventoryTransaction

    @ApiProperty({ type: 'enum', enum: BloodItems, isArray: true })
    @IsEnum(BloodItems, { each: true })
    itemTypes: BloodItems[];

    @ApiProperty({ type: 'string', format: 'date-time' })
    @IsDateString()
    @IsOptional()
    expiry: string = new Date(Date.now() + CONSTANTS.BLOOD_EXPIRY_INTERVAL).toISOString();

    @ApiProperty({ type: 'enum', enum: BloodInventoryStatus })
    @IsEnum(BloodInventoryStatus)
    @IsOptional()
    status: BloodInventoryStatus;

    @ApiProperty({ type: 'strign', format: 'uuid' })
    @IsUUID()
    bloodBag!: string
}
