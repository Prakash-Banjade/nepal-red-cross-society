import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDonationEventDto {
  @ApiProperty({ type: 'string', description: 'Event host name' })
  @IsString()
  @IsNotEmpty()
  host: string;

  @ApiProperty({ type: 'string', description: 'Event location' })
  @IsString()
  @IsNotEmpty()
  location: string;

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

  @ApiProperty({ type: 'string', description: 'Event date' })
  @IsString()
  @IsNotEmpty()
  date: string;
}
