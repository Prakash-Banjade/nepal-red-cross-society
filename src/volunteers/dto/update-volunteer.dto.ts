import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateVolunteerDto } from './create-volunteer.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateVolunteerDto extends PartialType(CreateVolunteerDto) {
    @ApiPropertyOptional({ type: String, description: 'Donation Event id' })
    @IsOptional()
    @IsString()
    donationEvent?: string;
}
