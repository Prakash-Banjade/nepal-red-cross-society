import { BadRequestException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';
import { FileSystemStoredFile, HasMimeType, IsFile } from 'nestjs-form-data';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';

export class CreateDonationEventDto extends CreateAddressDto {
  @ApiProperty({ type: 'string', description: 'Event name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'string', description: 'Event start date', example: '2024-05-09T07:12:13.012Z' })
  @IsString()
  @IsDateString()
  startDate: string;

  @ApiProperty({ type: 'string', description: 'Event end date', example: '2024-05-09T07:12:13.012Z' })
  @IsString()
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ format: 'uuidv4', description: 'Organization id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  organization?: string;

  @ApiProperty({ type: 'string', description: 'Event map link' })
  @IsString()
  @IsNotEmpty()
  mapLink: string;

  @ApiProperty({ type: 'string', description: 'Event contact person name' })
  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @ApiProperty({ type: 'string', description: 'Event primary contact number' })
  @IsPhoneNumber('NP')
  @IsNotEmpty()
  primaryContact: string;

  @ApiProperty({ type: 'string', description: 'Event secondary contact number' })
  @IsPhoneNumber('NP')
  @IsNotEmpty()
  secondaryContact: string;

  @ApiProperty({ type: 'number', description: 'Event expected donations' })
  @Transform(({ value }) => {
    if (isNaN(parseInt(value))) throw new BadRequestException('Expected Donations must be a number');
    return parseInt(value);
  })
  @IsNotEmpty()
  expectedDonations: number;

  @ApiPropertyOptional({
    type: 'string',
    isArray: true,
    description: 'Event technicians',
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsUUID('4', { each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value]
    } else return value;
  })
  technicians?: string[];

  @ApiPropertyOptional({ format: 'binary', type: 'string', description: 'Event cover image' })
  @IsOptional()
  coverImage?: FileSystemStoredFile;

  @ApiPropertyOptional({ type: 'string', description: 'Event description' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ format: 'binary', type: 'string', description: 'Event document' })
  @IsFile()
  @HasMimeType(['application/pdf', 'application/msword', 'image/*', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
  document: FileSystemStoredFile;
}