import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsPhoneNumber, IsString, Min } from "class-validator";
import { BloodGroup, Cast, Gender, Race } from "src/types/global.types";

export class CreateDonorDto {
    @ApiProperty({ description: 'Donor name' })
    @IsString()
    @Min(3)
    name: string;

    @ApiProperty({ type: 'enum', enum: Gender, description: 'Donor gender' })
    @IsEnum(Gender, { message: 'Invalid gender. Gender must be either male or female or other.' })
    gender: Gender;

    @ApiProperty({ type: 'enum', enum: Race, description: 'Donor race' })
    @IsEnum(Race, { message: 'Invalid race. Race must be either mahila, janajati, adiwashi, dalit.' })
    race: Race;

    @ApiProperty({ type: 'enum', enum: Cast, description: 'Donor cast' })
    @IsEnum(Cast, { message: 'Invalid cast. Cast must be either mla, mla, mla, mla.' })
    cast: Cast;

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
