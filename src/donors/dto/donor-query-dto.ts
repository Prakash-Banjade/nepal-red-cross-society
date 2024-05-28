import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString, Min, ValidateIf } from "class-validator";
import { QueryDto } from "src/core/dto/queryDto";
import { Country } from "src/core/types/country.types";
import { District } from "src/core/types/districts.types";
import { BloodType, Caste, Gender, Race, Religion, RhFactor } from "src/core/types/global.types";
import { Municipal } from "src/core/types/municipals.types";
import { Province } from "src/core/types/provinces.types";

export class DonorQueryDto extends QueryDto {
    @ApiPropertyOptional({ type: 'enum', enum: Gender, description: 'Donor gender' })
    @IsEnum(Gender, { message: 'Invalid gender. Gender must be either male or female or other.' })
    @IsOptional()
    gender?: Gender;

    @ApiPropertyOptional({ type: 'enum', enum: Race, description: 'Donor race', default: Race.NONE })
    @IsEnum(Race, { message: 'Invalid race. Race must be either mahila, janajati, adiwashi, dalit.' })
    @IsOptional()
    race?: Race = Race.NONE;

    @ApiPropertyOptional({ type: 'enum', enum: Caste, description: 'Donor caste' })
    @IsEnum(Caste, { message: 'Invalid caste. Caste must be either ' + Object.values(Caste).join(', ') })
    @IsOptional()
    caste?: Caste;

    @ApiPropertyOptional({ type: 'enum', enum: Religion, description: 'Donor religion' })
    @IsEnum(Religion, { message: 'Invalid religion. Religion must be either ' + Object.values(Religion).join(', ') })
    @IsOptional()
    religion?: Religion;

    @ApiPropertyOptional({ type: 'enum', enum: BloodType, description: 'Donor blood type' })
    @IsEnum(BloodType, { message: 'Invalid blood type. Blood type must be either ' + Object.values(BloodType).join(', ') })
    @IsOptional()
    bloodType?: BloodType;

    @ApiPropertyOptional({ type: 'enum', enum: RhFactor, description: 'Donor blood RH-factor' })
    @IsEnum(RhFactor, { message: 'Invalid rh factor. Rh factor must be either ' + Object.values(RhFactor).join(', ') })
    @IsOptional()
    rhFactor?: RhFactor;

    @ApiPropertyOptional({ enum: Country })
    @IsEnum(Country)
    @IsOptional()
    country?: Country;

    @ApiPropertyOptional({ type: 'enum', enum: Province, description: 'Province' })
    @IsEnum(Province, { message: 'Invalid province. Province must be either Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim.' })
    @ValidateIf((object) => object.country === Country.NP) // field is required only if country is Nepal
    @IsOptional()
    province?: Province;

    @ApiPropertyOptional({ type: 'enum', enum: District, description: 'District' })
    @IsEnum(District, { message: 'Invalid district.' })
    @ValidateIf((object) => object.country === Country.NP) // field is required only if country is Nepal
    @IsOptional()
    district?: District;

    @ApiPropertyOptional({ type: 'enum', enum: Municipal, description: 'Municipality' })
    @IsEnum(Municipal, { message: 'Invalid municipality.' })
    @ValidateIf((object) => object.country === Country.NP) // field is required only if country is Nepal
    @IsOptional()
    municipality?: Municipal;

    @ApiPropertyOptional({ description: 'Ward number', default: 1 })
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    @ValidateIf((object) => object.country === Country.NP) // field is required only if country is Nepal
    @IsOptional()
    ward?: number;

    @ApiPropertyOptional({ description: 'Street name' })
    @IsString()
    @IsOptional()
    street?: string;
}