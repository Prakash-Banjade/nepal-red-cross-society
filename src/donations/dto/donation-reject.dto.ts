import { IsNotEmpty, IsString } from "class-validator";

export class DonationRejectDto {
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    failedReasons: string[]
}

export class DonationVerifyDto {
    @IsString()
    @IsNotEmpty()
    verifiedby: string
}