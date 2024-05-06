import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';

export class CreateVolunteerDto extends CreateAddressDto {
  @ApiProperty({ type: 'string', description: 'Name of volunteer' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'string', description: 'Role of volunteer' })
  @IsString()
  @IsNotEmpty()
  role: string;
}
