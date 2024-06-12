import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { BloodComponent } from "src/core/types/fieldsEnum.types";

export class CreateBagTypeDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    name!: string

    @ApiProperty({ type: [String] })
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    components: string[] = [BloodComponent.FRESH_BLOOD]
}
