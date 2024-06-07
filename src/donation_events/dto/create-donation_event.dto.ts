import { BadRequestException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { FileSystemStoredFile, HasMimeType, IsFile } from 'nestjs-form-data';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';

export class CreateDonationEventDto extends CreateAddressDto {
  @ApiProperty({ type: 'string', description: 'Event name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'string', description: 'Event date', example: '2024-05-09T07:12:13.012Z' })
  @IsString()
  @IsDateString()
  date: string;

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
  @IsString()
  @IsNotEmpty()
  primaryContact: string;

  @ApiProperty({ type: 'string', description: 'Event secondary contact number' })
  @IsString()
  @IsNotEmpty()
  secondaryContact: string;

  @ApiProperty({ type: 'number', description: 'Event expected donations' })
  @Transform(({ value }) => {
    const num = parseInt(value)
    if (isNaN(num)) throw new BadRequestException('Invalid expected donations. Expected number')
    return num
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