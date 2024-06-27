import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateLabReportDto } from './create-lab_report.dto';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, IsUUID, ValidateIf } from 'class-validator';

export class UpdateLabReportDto extends PartialType(OmitType(CreateLabReportDto, ['componentIds', 'failedReasons'])) {
    @ApiProperty({ type: [String], description: 'Array of component ids', format: 'uuidv4', isArray: true })
    @IsUUID("all", { message: 'Invalid component ids. Component ids must be UUIDs', each: true })
    @IsArray()
    @ArrayMinSize(1, { message: 'Component ids cannot be empty' })
    @ValidateIf(o => !o.failedReasons?.length)
    @IsNotEmpty({ each: true })
    componentIds: string[] = [];

    @ApiPropertyOptional({ type: [String], description: 'Array of failed reasons in string', isArray: true })
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @IsArray()
    @ArrayMinSize(1, { message: 'Failed reasons cannot be empty' })
    @ValidateIf(o => !o.componentIds?.length)
    failedReasons: string[]
}
