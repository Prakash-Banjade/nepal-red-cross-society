import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length, ValidateIf } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile } from "nestjs-form-data";
import { CreateAddressDto } from "src/address/dto/create-address.dto";
import { BloodType, Caste, Gender, Race, Religion, RhFactor } from "src/core/types/global.types";

export class CreateDonorDto extends CreateAddressDto {
    @ApiProperty({ description: 'Donor first name' })
    @IsString()
    @Length(3, 20)
    firstName!: string;

    @ApiProperty({ description: 'Donor last name' })
    @IsString()
    @Length(3, 20)
    lastName!: string;

    @ApiProperty({ type: 'enum', enum: Gender, description: 'Donor gender' })
    @IsEnum(Gender, { message: 'Invalid gender. Gender must be either male or female or other.' })
    gender!: Gender;

    @ApiProperty({ description: 'Donor email', format: 'Email', example: 'techiesakar@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiPropertyOptional({ type: 'enum', enum: Race, description: 'Donor race' })
    @IsEnum(Race, { message: 'Invalid race. Race must be either mahila, janajati, adiwashi, dalit.' })
    @IsOptional()
    race?: Race = null;

    @ApiProperty({ type: 'enum', enum: Caste, description: 'Donor caste' })
    @IsEnum(Caste, { message: 'Invalid caste. Caste must be either ' + Object.values(Caste).join(', ') })
    caste!: Caste;

    @ApiProperty({ type: 'enum', enum: Religion, description: 'Donor religion' })
    @IsEnum(Religion, { message: 'Invalid religion. Religion must be either ' + Object.values(Religion).join(', ') })
    religion!: Religion;

    @ApiProperty({ description: 'Donor phone number (NP)', example: '9841234567' })
    @IsPhoneNumber('NP')
    phone!: string;

    @ApiProperty({ description: 'Emergency contact (NP)', example: '9841234567' })
    @IsPhoneNumber('NP')
    emergencyContact: string;

    @ApiProperty({ description: 'Donor date of birth', example: '2024-05-09T07:12:13.012Z' })
    @IsString()
    @IsDateString()
    dob!: string;

    @ApiProperty({ description: 'Donor weight', example: 50 })
    @IsNotEmpty()
    weight: number;

    @ApiProperty({ type: 'enum', enum: BloodType, description: 'Donor blood type' })
    @IsEnum(BloodType, { message: 'Invalid blood type. Blood type must be either ' + Object.values(BloodType).join(', ') })
    bloodType!: BloodType;

    @ApiProperty({ type: 'enum', enum: RhFactor, description: 'Donor blood RH-factor' })
    @IsEnum(RhFactor, { message: 'Invalid rh factor. Rh factor must be either ' + Object.values(RhFactor).join(', ') })
    rhFactor!: RhFactor;

    @ApiPropertyOptional({ type: 'file', format: 'binary', description: 'Donor image' })
    @IsOptional()
    @IsFile({ message: 'Invalid image. Image must be either jpeg or png.' })
    @HasMimeType(['image/jpeg', 'image/png'])
    // @ValidateIf(o => o.image)
    image: FileSystemStoredFile;
}
