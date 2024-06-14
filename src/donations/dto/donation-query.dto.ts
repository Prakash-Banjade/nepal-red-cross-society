import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { QueryDto } from "src/core/dto/queryDto";
import { BloodType, DonationStatus, DonationType, RhFactor } from "src/core/types/fieldsEnum.types";
export class DonationQueryDto extends QueryDto {
    @ApiPropertyOptional({ enum: DonationType, description: 'Donation type' })
    @IsOptional()
    donationType?: DonationType

    @ApiPropertyOptional({ enum: DonationStatus, default: DonationStatus.PENDING, description: 'Default status will be PENDING' })
    @IsOptional()
    status?: DonationStatus;

    @ApiPropertyOptional({ type: 'enum', enum: BloodType, description: 'Donor blood type' })
    // @IsEnum(BloodType, { message: 'Invalid blood type. Blood type must be either ' + Object.values(BloodType).join(', ') })
    @IsOptional()
    bloodType?: BloodType;

    @ApiPropertyOptional({ type: 'enum', enum: RhFactor, description: 'Donor blood RH-factor' })
    // @IsEnum(RhFactor, { message: 'Invalid rh factor. Rh factor must be either ' + Object.values(RhFactor).join(', ') })
    @IsOptional()
    rhFactor?: RhFactor;

    @ApiPropertyOptional()
    @IsOptional()
    organizationName?: string;
}