import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTestCaseDto } from './create-test_case.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateTestCaseDto extends PartialType(CreateTestCaseDto) {
    @ApiPropertyOptional({ format: 'uuidv4', type: 'string' })
    @IsUUID()
    @IsNotEmpty()
    labReport: string;
}
