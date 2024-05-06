import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsInt, IsNotEmpty, IsPhoneNumber, IsString, Length, Min } from "class-validator";
import { District, Province } from "src/types/address.types";
import { BloodGroup, Cast, Gender, Race } from "src/types/global.types";
import { Municipal } from "src/types/municipals.types";

export class CreateDonorDto {
    @ApiProperty({ description: 'Donor name' })
    @IsString()
    @Length(3, 50)
    name: string;

    @ApiProperty({ type: 'enum', enum: Gender, description: 'Donor gender' })
    @IsEnum(Gender, { message: 'Invalid gender. Gender must be either male or female or other.' })
    gender: Gender;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ type: 'enum', enum: Race, description: 'Donor race' })
    @IsEnum(Race, { message: 'Invalid race. Race must be either mahila, janajati, adiwashi, dalit.' })
    race: Race;

    @ApiProperty({ type: 'enum', enum: Cast, description: 'Donor cast' })
    @IsEnum(Cast, { message: 'Invalid cast. Cast must be either ' + Object.values(Cast).join(', ') })
    cast: Cast;

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

    @ApiProperty({ description: 'Donor phone number (NP)' })
    @IsPhoneNumber('NP')
    phone: string;

    @ApiProperty({ description: 'Donor date of birth' })
    @IsString()
    dob: string;

    @ApiProperty({ type: 'enum', enum: BloodGroup, description: 'Donor blood group' })
    @IsEnum(BloodGroup, { message: 'Invalid blood group. Blood group must be either A+, A-, B+, B-, AB+, AB-, O+, O-.' })
    bloodGroup: BloodGroup;
}
