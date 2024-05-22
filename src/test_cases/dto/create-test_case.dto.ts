import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TestCaseStatus } from "src/core/types/global.types";

export class CreateTestCaseDto {
    @ApiProperty({ type: 'string', description: 'Test Case Name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    desiredResult: string;

    @ApiProperty({ type: 'enum', enum: TestCaseStatus, description: 'Test Case Status' })
    @IsEnum(TestCaseStatus)
    @IsNotEmpty()
    status: TestCaseStatus;
}
