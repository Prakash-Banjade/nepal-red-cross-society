import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDefined, IsEnum, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, IsUUID, ValidateNested } from "class-validator";
import { TestCaseStatus } from "src/core/types/global.types";

class TestCase {
    @ApiProperty({ format: 'uuidv4' })
    @IsUUID()
    @IsNotEmpty()
    testCase: string;

    @ApiProperty({ type: 'string', description: 'Obtained result' })
    @IsString()
    @IsNotEmpty()
    obtainedResult: string;

    @ApiProperty({ type: 'enum', enum: TestCaseStatus, description: 'Test Case Status' })
    @IsEnum(TestCaseStatus)
    @IsNotEmpty()
    status: TestCaseStatus;
}

export class CreateLabReportDto {
    @ApiProperty({ format: 'date-time' })
    @IsNotEmpty()
    date: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    issuedBy: string;

    @ApiProperty({ format: 'uuidv4' })
    @IsUUID()
    @IsNotEmpty()
    donation: string;

    @ApiProperty({ isArray: true, description: 'Array of test case ids' })
    @IsDefined()
    @Type(() => TestCase)
    testCases: TestCase[];
}
