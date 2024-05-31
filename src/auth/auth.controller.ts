import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { CookieOptions, Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';
import { PasswordChangeRequestDto } from './dto/pwd-change-req.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    }

    ACCESS_TOKEN_EXPIRES = new Date(Date.now() + 1 * 60 * 1000) // adding 1 minute

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ description: 'Login with email and password. Returns access token.', summary: 'Login' })
    async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
        const { access_token, refresh_token, payload } = await this.authService.signIn(signInDto);

        res.cookie('refresh_token', refresh_token, this.cookieOptions);

        const expiresIn = this.ACCESS_TOKEN_EXPIRES;

        return { access_token, payload, expiresIn };
    }

    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Refresh access token. Returns new access token.', summary: 'Refresh' })
    async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refresh_token = req.cookies?.refresh_token;
        if (!refresh_token) throw new UnauthorizedException('No refresh token provided');

        const { new_access_token, new_refresh_token, payload } = await this.authService.refresh(refresh_token);

        res.cookie('refresh_token', new_refresh_token, this.cookieOptions);

        const expiresIn = this.ACCESS_TOKEN_EXPIRES;

        return { access_token: new_access_token, expiresIn, payload };
    }

    // @Public()
    // @Post('register')
    // @ApiOperation({ description: 'Register new user. Returns access token.', summary: 'Register' })
    // async register(@Body() registerDto: RegisterDto) {
    //     return await this.authService.register(registerDto);
    // }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ description: 'Logout. Deletes refresh token from DB.', summary: 'Logout' })
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        // on client also delete the access_token

        const refresh_token = req.cookies?.refresh_token;
        if (!refresh_token) return res.sendStatus(204)

        await this.authService.logout(refresh_token, res, this.cookieOptions);

        res.clearCookie('refresh_token', this.cookieOptions);
        return;
    }

    @Public()
    @Post('forgetPassword')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 1, ttl: 2000 } }) // override the default rate limit for password reset
    forgetPassword(@Body() { email }: PasswordChangeRequestDto) {
        return this.authService.forgetPassword(email)
    }

    @Public()
    @Post('resetPassword')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 1, ttl: 2000 } }) // override the default rate limit for password reset
    resetPassword(@Body() { password, confirmPassword, token }: ResetPasswordDto) {
        if (password !== confirmPassword) throw new BadRequestException('Passwords do not match');

        return this.authService.resetPassword(password, token);   
    }
}
