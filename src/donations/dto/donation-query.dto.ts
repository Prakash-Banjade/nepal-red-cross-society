import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/queryDto";
import { Country } from "src/core/types/country.types";
import { District } from "src/core/types/districts.types";
import { DonationStatus, DonationType } from "src/core/types/global.types";
import { Municipal } from "src/core/types/municipals.types";
import { Province } from "src/core/types/provinces.types";

export class DonationQueryDto extends QueryDto {
    @ApiPropertyOptional({ enum: DonationType, description: 'Donation type' })
    @IsOptional()
    donationType?: DonationType

    @ApiPropertyOptional({ description: 'Blood bag number' })
    @IsOptional()
    bloodBagNo?: string;

    @ApiPropertyOptional({ enum: DonationStatus, default: DonationStatus.PENDING, description: 'Default status will be PENDING' })
    @IsOptional()
    status?: DonationStatus;
}