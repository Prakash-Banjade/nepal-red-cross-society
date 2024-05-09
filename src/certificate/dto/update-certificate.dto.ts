import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCertificateDto } from './create-certificate.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateCertificateDto extends PartialType(CreateCertificateDto) {
    @ApiPropertyOptional({ type: String, format: 'uuid', description: 'Donation ID' })
    @IsUUID()
    @IsOptional()
    donation?: string;
}
