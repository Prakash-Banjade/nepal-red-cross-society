import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTestCaseDto {
    @ApiProperty({ type: 'string', description: 'Test Case Name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    desiredResult: string;
}
