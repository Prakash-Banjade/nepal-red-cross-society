import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsNotEmpty, } from "class-validator"

export class ReportQueryDto {
    // @ApiProperty({ enum: ReportPeriod, default: ReportPeriod.MONTHLY })
    // @IsEnum(ReportPeriod)
    // @IsOptional()
    // period: ReportPeriod = ReportPeriod.MONTHLY

    // @ApiProperty({ type: Number })
    // @Transform(({ value }) => {
    //     if (isNaN(parseInt(value))) throw new BadRequestException('Invalid year')
    //     return parseInt(value)
    // })
    // @IsNumber()
    // @IsOptional()
    // year: number

    // @ApiPropertyOptional({ type: Number })
    // @Transform(({ value }) => {
    //     if (isNaN(parseInt(value))) throw new BadRequestException('Invalid month')
    //     return parseInt(value)
    // })
    // @Min(1)
    // @Max(12)
    // @IsNumber()
    // @IsOptional()
    // month?: number

    // @ApiPropertyOptional({ type: Number })
    // @Transform(({ value }) => {
    //     if (isNaN(parseInt(value))) throw new BadRequestException('Invalid quarter')
    //     return parseInt(value)
    // })
    // @Min(1)
    // @Max(4)
    // @IsNumber()
    // @IsOptional()
    // quarter?: number

    @ApiProperty({ type: Date })
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @ApiProperty({ type: Date })
    @IsDateString()
    @IsNotEmpty()
    endDate: string;

}