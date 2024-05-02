import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVolunteerDto {
  @ApiProperty({ type: 'string', description: 'Name of volunteer' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'string', description: 'Address of volunteer' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ type: 'string', description: 'Role of volunteer' })
  @IsString()
  @IsNotEmpty()
  role: string;
}
