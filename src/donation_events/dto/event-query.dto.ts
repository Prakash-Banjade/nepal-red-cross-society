import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, ValidateIf } from "class-validator";
import { QueryDto } from "src/core/dto/queryDto";
import { Country } from "src/core/types/country.types";
import { District } from "src/core/types/districts.types";
import { Municipal } from "src/core/types/municipals.types";
import { Province } from "src/core/types/provinces.types";

export class EventQueryDto extends QueryDto {
    @ApiPropertyOptional({ enum: Country })
    // @IsEnum(Country)
    @IsOptional()
    country?: Country;

    @ApiPropertyOptional({ type: 'enum', enum: Province, description: 'Province' })
    // @IsEnum(Province, { message: 'Invalid province. Province must be either Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim.' })
    // @ValidateIf((object) => object.country === Country.NP) // field is required only if country is Nepal
    @IsOptional()
    province?: Province;

    @ApiPropertyOptional({ type: 'enum', enum: District, description: 'District' })
    // @IsEnum(District, { message: 'Invalid district.' })
    // @ValidateIf((object) => object.country === Country.NP) // field is required only if country is Nepal
    @IsOptional()
    district?: District;

    @ApiPropertyOptional({ type: 'enum', enum: Municipal, description: 'Municipality' })
    // @IsEnum(Municipal, { message: 'Invalid municipality.' })
    // @ValidateIf((object) => object.country === Country.NP) // field is required only if country is Nepal
    @IsOptional()
    municipality?: Municipal;

    @ApiPropertyOptional({ description: 'Ward number' })
    // @ValidateIf((object) => object.country === Country.NP) // field is required only if country is Nepal
    @IsOptional()
    ward?: number;

    @ApiPropertyOptional({ description: 'Street name' })
    @IsString()
    @IsOptional()
    street?: string;
}