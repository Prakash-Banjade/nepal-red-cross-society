import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { QueryDto } from "src/core/dto/queryDto";
import { BloodType, RhFactor } from "src/core/types/global.types";

export class BloodRequestQueryDto extends QueryDto {
    @ApiPropertyOptional({ type: 'enum', enum: BloodType, description: 'Donor blood type' })
    @IsOptional()
    bloodType?: BloodType;

    @ApiPropertyOptional({ type: 'enum', enum: RhFactor, description: 'Donor blood RH-factor' })
    @IsOptional()
    rhFactor?: RhFactor;
}