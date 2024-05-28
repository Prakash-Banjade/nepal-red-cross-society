import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { FileSystemStoredFile, IsFile } from 'nestjs-form-data';
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

  @ApiProperty({ type: 'string', description: 'Event leader name' })
  @IsString()
  @IsNotEmpty()
  leader: string;

  @ApiPropertyOptional({
    type: 'string',
    isArray: true,
    description: 'Event volunteers',
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
  volunteers?: string[];

  @ApiPropertyOptional({ format: 'binary', type: 'string', description: 'Event cover image' })
  @IsOptional()
  coverImage?: FileSystemStoredFile;

  @ApiPropertyOptional({ type: 'string', description: 'Event description' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}