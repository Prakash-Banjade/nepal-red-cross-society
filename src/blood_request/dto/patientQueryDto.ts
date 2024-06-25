import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { QueryDto } from "src/core/dto/queryDto";
import { BloodType, RhFactor } from "src/core/types/fieldsEnum.types";

export class PatientQueryDto extends QueryDto {
    @ApiPropertyOptional({ type: 'enum', enum: BloodType, description: 'Patient blood type' })
    // @IsEnum(BloodType, { message: 'Invalid blood type. Blood type must be either ' + Object.values(BloodType).join(', ') })
    @IsOptional()
    bloodType?: BloodType;

    @ApiPropertyOptional({ type: 'enum', enum: RhFactor, description: 'Patient blood RH-factor' })
    // @IsEnum(RhFactor, { message: 'Invalid rh factor. Rh factor must be either ' + Object.values(RhFactor).join(', ') })
    @IsOptional()
    rhFactor?: RhFactor;
}