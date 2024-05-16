import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, ValidateIf } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile } from "nestjs-form-data";
import { CreateAddressDto } from "src/address/dto/create-address.dto";

export class CreateOrganizationDto extends CreateAddressDto {
    @ApiProperty({ description: 'Name of the organization' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Contact number of the organization' })
    @IsPhoneNumber('NP', { message: 'Contact number is not valid' })
    @IsNotEmpty()
    contact: string;

    @ApiProperty({ description: 'Owner of the organization' })
    @IsString()
    @IsNotEmpty()
    representative: string;

    @ApiProperty({ description: 'Representative contact of the organization' })
    @IsPhoneNumber('NP', { message: 'Representative contact number is not valid' })
    @IsNotEmpty()
    representativeContact: string;

    @ApiProperty({ type: 'string', format: 'email', description: 'Email of the organization' })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ type: 'file', format: 'binary', description: 'Donor image' })
    @IsFile({ message: 'Invalid image. Image must be either jpeg or png.' })
    @HasMimeType(['image/jpeg', 'image/png'])
    logo: FileSystemStoredFile;
}
