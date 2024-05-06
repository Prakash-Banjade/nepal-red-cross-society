import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTestCaseDto {
    @ApiProperty({ type: 'string', isArray: true })
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    particular: string[];

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    desiredResult: string;
}
