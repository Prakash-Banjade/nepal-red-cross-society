import { PartialType } from '@nestjs/swagger';
import { CreateLabReportDto } from './create-lab_report.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLabReportDto extends PartialType(CreateLabReportDto) {}
