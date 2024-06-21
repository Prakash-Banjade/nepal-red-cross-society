import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { QueryDto } from "src/core/dto/queryDto";
import { BloodType, RhFactor } from "src/core/types/fieldsEnum.types";
import { Municipal } from "src/core/types/municipals.types";

export class BloodRequestQueryDto extends QueryDto {
    @ApiPropertyOptional({ type: 'enum', enum: BloodType, description: 'Donor blood type' })
    @IsOptional()
    bloodType?: BloodType;

    @ApiPropertyOptional({ type: 'enum', enum: RhFactor, description: 'Donor blood RH-factor' })
    @IsOptional()
    rhFactor?: RhFactor;

    @ApiPropertyOptional({ type: 'enum', enum: Municipal, description: 'Hospital Municipal' })
    @IsOptional()
    municipality?: Municipal;
}