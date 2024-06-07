import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBranchDto {
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    name: string
}
