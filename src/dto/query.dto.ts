import { Transform } from "class-transformer";
import { IsString } from "class-validator";

export class PaginationDto {
    @IsString()
    @Transform(({ value }) => +value)
    page: number = 1;

    @IsString()
    @Transform(({ value }) => +value)
    limit: number = 10;
}