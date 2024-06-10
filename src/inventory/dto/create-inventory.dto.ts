import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateInventoryDto {
    @ApiProperty({ type: 'string', description: 'Item name' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ type: 'string', description: 'Item unit' })
    @IsString()
    @IsNotEmpty()
    unit!: string;
}
