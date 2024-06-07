import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateBloodBagDto } from "src/blood-bags/dto/create-blood-bag.dto";
import { CONSTANTS } from "src/CONSTANTS";
import { BloodInventoryStatus, BloodItems, BloodType, RhFactor } from "src/core/types/fieldsEnum.types";

export class CreateBloodInventoryDto extends CreateBloodBagDto {
    @ApiProperty({ type: 'enum', enum: BloodType })
    @IsEnum(BloodType)
    bloodType: BloodType

    @ApiProperty({ type: 'enum', enum: RhFactor })
    @IsEnum(RhFactor)
    rhFactor: RhFactor;

    // @ApiProperty({ type: 'int', default: 0 })
    // @Transform(({ value }) => parseInt(value))
    // quantity: number;

    @ApiProperty({ type: 'enum', enum: BloodItems })
    @IsEnum(BloodItems)
    itemType: BloodItems;

    @ApiProperty({ type: 'string', format: 'date-time' })
    @IsDateString()
    @IsOptional()
    expiresAt: string = new Date(Date.now() + CONSTANTS.BLOOD_EXPIRY_INTERVAL).toISOString();

    @ApiProperty({ type: 'enum', enum: BloodInventoryStatus })
    @IsEnum(BloodInventoryStatus)
    @IsOptional()
    status: BloodInventoryStatus;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    itemId: string;
}
