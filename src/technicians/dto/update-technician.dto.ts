import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateTechnicianDto } from './create-technician.dto';
import { IsOptional, IsString } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';

export class UpdateTechnicianDto extends PartialType(OmitType(CreateTechnicianDto, ['image'])) {
    @ApiPropertyOptional({ type: 'file', format: 'binary', description: 'Technician image' })
    @IsOptional()
    image?: FileSystemStoredFile | string;
}
