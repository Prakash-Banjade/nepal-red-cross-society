import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateOrganizationDto } from './create-organization.dto';
import { IsOptional, IsUUID } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';

export class UpdateOrganizationDto extends PartialType(OmitType(CreateOrganizationDto, ['logo'])) {
    @ApiPropertyOptional({ type: String, isArray: true, format: 'uuid' })
    @IsUUID('4', { each: true })
    @IsOptional()
    donations?: string[]

    @ApiProperty({ type: 'file', format: 'binary', description: 'Donor image' })
    logo: FileSystemStoredFile | string;
}
