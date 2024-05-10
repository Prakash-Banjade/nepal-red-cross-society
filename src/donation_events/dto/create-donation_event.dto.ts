import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { FileSystemStoredFile, IsFile } from 'nestjs-form-data';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';

export class CreateDonationEventDto extends CreateAddressDto {
  @ApiProperty({ type: 'string', description: 'Event date' })
  @IsString()
  @IsNotEmpty()
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

  @ApiProperty({
    type: 'string',
    isArray: true,
    description: 'Event volunteers',
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsUUID('4', { each: true })
  volunteers: string[];

  @ApiProperty({ format: 'binary', type: 'string', description: 'Event cover image' })
  @IsFile({ message: 'Cover must be a file' })
  coverImage: FileSystemStoredFile;

  @ApiProperty({ type: 'string', description: 'Event description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}