import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { District, Province } from "src/types/address.types";
import { Country } from "src/types/country.types";
import { Municipal } from "src/types/municipals.types";

export class CreateAddressDto {
    @ApiProperty({ enum: Country })
    @IsEnum(Country)
    @IsNotEmpty()
    country: Country;

    @ApiProperty({ type: 'enum', enum: Province, description: 'Province' })
    @IsEnum(Province, { message: 'Invalid province. Province must be either Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim.' })
    province: Province;

    @ApiProperty({ type: 'enum', enum: District, description: 'Donor district' })
    @IsEnum(District, { message: 'Invalid district.' })
    district: District;

    @ApiProperty({ type: 'enum', enum: Municipal, description: 'Donor municipality' })
    @IsEnum(Municipal, { message: 'Invalid municipality.' })
    municipality: Municipal;

    @ApiProperty({ description: 'Donor ward number' })
    @IsInt()
    @Min(1)
    ward: number;

    @ApiProperty({ description: 'Donor street name' })
    @IsString()
    @IsNotEmpty()
    street: string;
}
