import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator";

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
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    testCases: string[];
}
