import { PartialType } from '@nestjs/swagger';
import { CreateTestCaseDto } from './create-test_case.dto';

export class UpdateTestCaseDto extends PartialType(CreateTestCaseDto) {}
