import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateDonorDto } from './create-donor.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { IsOptional } from 'class-validator';

export class UpdateDonorDto extends PartialType(CreateDonorDto) {
    @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Donor image' })
    @IsOptional()
    image?: FileSystemStoredFile | string;
}
