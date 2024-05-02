import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class RegisterDto {
    @ApiProperty({ type: 'string', description: 'First name must be at least 3 characters long' })
    @IsString()
    @IsNotEmpty()
    @Length(3)
    firstName: string;

    @ApiProperty({ type: 'string', description: 'Last name must be at least 3 characters long' })
    @IsString()
    @IsNotEmpty()
    @Length(3)
    lastName: string;

    @ApiProperty({ type: 'string', format: 'email', description: 'Valid email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ type: 'string', description: 'Password must be at least 8 characters long' })
    @IsString()
    @Length(8)
    password: string;
}