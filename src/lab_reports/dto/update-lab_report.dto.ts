import { PartialType } from '@nestjs/swagger';
import { CreateLabReportDto } from './create-lab_report.dto';

export class UpdateLabReportDto extends PartialType(CreateLabReportDto) {}
