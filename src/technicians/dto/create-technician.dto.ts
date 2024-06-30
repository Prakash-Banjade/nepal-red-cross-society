import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';
import { FileSystemStoredFile, HasMimeType, IsFile } from 'nestjs-form-data';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { Education, Gender } from 'src/core/types/fieldsEnum.types';

export class CreateTechnicianDto extends CreateAddressDto {
  @ApiProperty({ description: 'Technician first name' })
  @IsString()
  @Length(3, 20)
  firstName!: string;

  @ApiProperty({ description: 'Technician last name' })
  @IsString()
  @Length(2, 20)
  lastName!: string;

  @ApiProperty({ type: 'enum', enum: Gender, description: 'Technician gender' })
  @IsEnum(Gender, { message: 'Invalid gender. Gender must be either male or female or other.' })
  gender!: Gender;

  @ApiProperty({ type: 'string', description: 'Role of technician' })
  @IsString()
  @IsNotEmpty()
  role!: string;

  @ApiProperty({ type: 'enum', enum: Education, description: 'Technician education' })
  @IsEnum(Education, { message: 'Invalid education. Education must be either' + Object.values(Education).join(' or ') })
  @IsNotEmpty()
  education!: Education;

  @ApiProperty({ type: 'string', description: 'Technician phone number (NP)' })
  @IsPhoneNumber('NP')
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ type: 'file', format: 'binary', description: 'Technician image' })
  @IsOptional()
  // @IsFile({ message: 'Invalid image. Image must be either jpeg or png.' })
  // @HasMimeType(['image/jpeg', 'image/png'])
  image: FileSystemStoredFile;
}
