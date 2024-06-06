import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { QueryDto } from "src/core/dto/queryDto";
import { BloodInventoryStatus, BloodItems } from "src/core/types/fieldsEnum.types";

export class BloodInventoryItemQueryDto extends QueryDto {
    @ApiPropertyOptional({ type: 'enum', enum: BloodInventoryStatus, default: BloodInventoryStatus.USABLE })
    // @IsEnum(BloodInventoryStatus)
    @IsOptional()
    status?: BloodInventoryStatus = BloodInventoryStatus.USABLE;

    @ApiPropertyOptional({ type: 'enum', enum: BloodItems })
    // @IsEnum(BloodItems)
    @IsOptional()
    itemType?: BloodItems

}