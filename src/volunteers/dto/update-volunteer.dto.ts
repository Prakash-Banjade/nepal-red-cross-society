import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateVolunteerDto } from './create-volunteer.dto';
import { IsOptional, IsString } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';

export class UpdateVolunteerDto extends PartialType(OmitType(CreateVolunteerDto, ['image'])) {
    @ApiPropertyOptional({ type: String, description: 'Donation Event id' })
    @IsOptional()
    @IsString()
    donationEvent?: string;

    @ApiPropertyOptional({ type: 'file', format: 'binary', description: 'Donor image' })
    @IsOptional()
    image?: FileSystemStoredFile | string;
}
