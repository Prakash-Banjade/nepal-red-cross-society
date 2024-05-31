import { IsEmail, IsEnum, IsOptional } from "class-validator";
import { QueryDto } from "src/core/dto/queryDto";
import { Roles } from "src/core/types/global.types";

export class UserQueryDto extends QueryDto {

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsEnum(Roles)
    @IsOptional()
    role?: Roles;
}