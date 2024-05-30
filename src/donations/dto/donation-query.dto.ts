import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { QueryDto } from "src/core/dto/queryDto";
import { DonationStatus, DonationType } from "src/core/types/global.types";
export class DonationQueryDto extends QueryDto {
    @ApiPropertyOptional({ enum: DonationType, description: 'Donation type' })
    @IsOptional()
    donationType?: DonationType

    @ApiPropertyOptional({ enum: DonationStatus, default: DonationStatus.PENDING, description: 'Default status will be PENDING' })
    @IsOptional()
    status?: DonationStatus;
}