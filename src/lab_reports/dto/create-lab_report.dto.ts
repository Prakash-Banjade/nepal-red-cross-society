import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, IsUUID, ValidateNested } from "class-validator";

class TestCase {
    @ApiProperty({ format: 'uuidv4' })
    @IsUUID()
    @IsNotEmpty()
    testCase: string;

    @ApiProperty({ type: 'string', description: 'Obtained result' })
    @IsString()
    @IsNotEmpty()
    obtainedResult: string;
}

export class CreateLabReportDto {
    @ApiProperty({ format: 'date-time' })
    @IsDate()
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
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => TestCase)
    testCases: TestCase[];
}
