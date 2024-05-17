import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { v4 as uuidv4 } from 'uuid';
import { CookieOptions, Request, Response } from 'express';
import { AuthUser, RequestUser } from 'src/core/types/global.types';
require('dotenv').config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  REFRESH_TOKEN_EXPIRE = '7d';
  ACCESS_TOKEN_EXPIRE = '1m';

  async signIn(signInDto: SignInDto) {
    const foundUser = await this.usersRepository.findOneBy({
      email: signInDto.email,
    });

    if (!foundUser)
      throw new UnauthorizedException(
        'This email is not registered. Please register first.',
      );

    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      foundUser.password,
    );

    if (!isPasswordValid) throw new BadRequestException('Invalid password');

    const payload: RequestUser = {
      email: foundUser.email,
      userId: foundUser.id,
      name: foundUser.firstName + ' ' + foundUser.lastName,
      role: foundUser.role,
    };

    const access_token = await this.createAccessToken(payload);

    const refresh_token = await this.createRefreshToken(foundUser.id);

    foundUser.refresh_token = refresh_token;

    await this.usersRepository.save(foundUser);

    return { access_token, refresh_token, payload, expiresIn: this.ACCESS_TOKEN_EXPIRE };
  }

  async createAccessToken(payload: AuthUser) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.ACCESS_TOKEN_EXPIRE,
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async createRefreshToken(userId: string) {
    const tokenId = uuidv4();
    return await this.jwtService.signAsync(
      { id: userId, tokenId: tokenId },
      { expiresIn: this.REFRESH_TOKEN_EXPIRE, secret: process.env.REFRESH_TOKEN_SECRET },
    );
  }

  async refresh(refresh_token: string) {
    // verifying the refresh token
    const decoded = await this.jwtService.verifyAsync(refresh_token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    if (!decoded) throw new ForbiddenException('Invalid token');

    // Is refresh token in db?
    const foundUser = await this.usersRepository.findOneBy({
      refresh_token,
      id: decoded.id,
    });

    if (!foundUser) throw new UnauthorizedException('Access Denied');

    // create new access token & refresh token
    const payload: RequestUser = {
      email: foundUser.email,
      userId: foundUser.id,
      name: foundUser.firstName + ' ' + foundUser.lastName,
      role: foundUser.role,
    };

    const new_access_token = await this.createAccessToken(payload);
    const new_refresh_token = await this.createRefreshToken(foundUser.id);

    // saving refresh_token with current user
    foundUser.refresh_token = new_refresh_token;
    await this.usersRepository.save(foundUser);

    return {
      new_access_token,
      new_refresh_token,
      payload,
    };
  }

  async logout(
    refresh_token: string,
    res: Response,
    cookieOptions: CookieOptions,
  ) {
    // Is refresh token in db?
    const foundUser = await this.usersRepository.findOneBy({ refresh_token });

    if (!foundUser) {
      res.clearCookie('refresh_token', cookieOptions);
      return res.sendStatus(204);
    }

    // delete refresh token in db
    foundUser.refresh_token = null;
    await this.usersRepository.save(foundUser);
  }

  async deleteUsers() {
    await this.usersRepository.delete({});
  }
}
