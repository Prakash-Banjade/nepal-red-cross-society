import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateDonationEventDto } from './create-donation_event.dto';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { FileSystemStoredFile, IsFile } from 'nestjs-form-data';

export class UpdateDonationEventDto extends PartialType(CreateDonationEventDto) {
    // @ApiPropertyOptional({
    //     type: 'string',
    //     isArray: true,
    //     description: 'Event volunteers',
    // })
    // @IsString({ each: true })
    // @IsNotEmpty({ each: true })
    // @IsUUID('4', { each: true })
    // @IsOptional()
    // donations?: string[]

    @ApiPropertyOptional({ format: 'binary', type: 'string', description: 'Event galleries', isArray: true })
    @IsFile({ message: 'Gallery image be a file', each: true })
    @IsOptional()
    gallery?: FileSystemStoredFile[];
}
