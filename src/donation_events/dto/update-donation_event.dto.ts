import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateDonationEventDto } from './create-donation_event.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { EventStatus } from 'src/core/types/fieldsEnum.types';

export class UpdateDonationEventDto extends PartialType(CreateDonationEventDto) {
    @ApiPropertyOptional({ format: 'binary', type: 'string', description: 'Event galleries', isArray: true })
    @IsOptional()
    gallery?: FileSystemStoredFile[] | string[];

    @ApiPropertyOptional({ type: 'enum', enum: EventStatus })
    @IsEnum(EventStatus)
    @IsOptional()
    status?: EventStatus;
}
