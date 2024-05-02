import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateOrganizationDto } from './create-organization.dto';
import { IsUUID } from 'class-validator';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
    @ApiPropertyOptional({ type: String, isArray: true, format: 'uuid' })
    @IsUUID('4', { each: true })
    donations?: string[]
}
