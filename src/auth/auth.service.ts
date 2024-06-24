import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';
import { AuthUser, RequestUser } from 'src/core/types/global.types';
import crypto from 'crypto'
import { PasswordChangeRequest } from './entities/password-change-request.entity';
import { MailService } from 'src/mail/mail.service';
require('dotenv').config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(PasswordChangeRequest) private passwordChangeRequestRepo: Repository<PasswordChangeRequest>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  REFRESH_TOKEN_EXPIRE = '7d';
  ACCESS_TOKEN_EXPIRE = '1m';

  async signIn(signInDto: SignInDto) {
    const foundUser = await this.usersRepository.findOne({
      where: { email: signInDto.email },
      relations: { branch: true }
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
      branchId: foundUser.branch.id,
      branchName: foundUser.branch.name
    };

    const access_token = await this.createAccessToken(payload);

    // const refresh_token = await this.createRefreshToken(foundUser.id);

    // foundUser.refresh_token = refresh_token;

    await this.usersRepository.save(foundUser);

    return { access_token, payload, };
  }

  async createAccessToken(payload: AuthUser) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.ACCESS_TOKEN_EXPIRE,
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  // async createRefreshToken(userId: string) {
  //   const tokenId = uuidv4();
  //   return await this.jwtService.signAsync(
  //     { id: userId, tokenId: tokenId },
  //     { expiresIn: this.REFRESH_TOKEN_EXPIRE, secret: process.env.REFRESH_TOKEN_SECRET },
  //   );
  // }

  // async refresh(refresh_token: string) {
  //   // verifying the refresh token
  //   const decoded = await this.jwtService.verifyAsync(refresh_token, {
  //     secret: process.env.REFRESH_TOKEN_SECRET,
  //   });

  //   if (!decoded) throw new ForbiddenException('Invalid token');

  //   // Is refresh token in db?
  //   const foundUser = await this.usersRepository.findOne({
  //     where: {
  //       refresh_token,
  //       id: decoded.id,
  //     },
  //     relations: { branch: true },
  //   });

  //   if (!foundUser) throw new UnauthorizedException('Access Denied');

  //   // create new access token & refresh token
  //   const payload: RequestUser = {
  //     email: foundUser.email,
  //     userId: foundUser.id,
  //     name: foundUser.firstName + ' ' + foundUser.lastName,
  //     role: foundUser.role,
  //     branchId: foundUser.branch.id,
  //     branchName: foundUser.branch.name
  //   };

  //   const new_access_token = await this.createAccessToken(payload);
  //   const new_refresh_token = await this.createRefreshToken(foundUser.id);

  //   // saving refresh_token with current user
  //   foundUser.refresh_token = new_refresh_token;
  //   await this.usersRepository.save(foundUser);

  //   return {
  //     new_access_token,
  //     new_refresh_token,
  //     payload,
  //   };
  // }

  // async logout(
  //   refresh_token: string,
  //   res: Response,
  //   cookieOptions: CookieOptions,
  // ) {
  //   // Is refresh token in db?
  //   const foundUser = await this.usersRepository.findOneBy({ refresh_token });

  //   if (!foundUser) {
  //     res.clearCookie('refresh_token', cookieOptions);
  //     return res.sendStatus(204);
  //   }

  //   // delete refresh token in db
  //   foundUser.refresh_token = null;
  //   await this.usersRepository.save(foundUser);
  // }

  async forgetPassword(email: string) {
    const foundUser = await this.usersRepository.findOneBy({ email });
    if (!foundUser) {
      await new Promise(res => setTimeout(res, 3000)); // fake delay

      return {
        message: 'Mail sent successfully. Please check your inbox.', // for security purpose
      }
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // existing request
    const existingRequest = await this.passwordChangeRequestRepo.findOneBy({ email });
    if (existingRequest) {
      await this.passwordChangeRequestRepo.remove(existingRequest);
    }

    const passwordChangeRequest = this.passwordChangeRequestRepo.create({
      email: foundUser.email,
      hashedResetToken,
    });
    await this.passwordChangeRequestRepo.save(passwordChangeRequest);

    const { previewUrl } = await this.mailService.sendResetPasswordLink(foundUser, resetToken);
    return {
      message: 'Token is valid for 5 minutes',
      resetToken,
      previewUrl,
    };
  }

  async resetPassword(password: string, providedResetToken: string) {
    // hash the provided token to check in database
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(providedResetToken)
      .digest('hex');

    // Retrieve the hashed reset token from the database
    const passwordChangeRequest = await this.passwordChangeRequestRepo.findOneBy({ hashedResetToken });

    if (!passwordChangeRequest) {
      throw new BadRequestException('Invalid reset token');
    }

    // Check if the reset token has expired
    const now = new Date();
    const resetTokenExpiration = new Date(passwordChangeRequest.createdAt);
    resetTokenExpiration.setMinutes(resetTokenExpiration.getMinutes() + 5); // 5 minutes
    if (now > resetTokenExpiration) {
      await this.passwordChangeRequestRepo.remove(passwordChangeRequest);
      throw new BadRequestException('Reset token has expired');
    }

    // retrieve the user from the database
    const user = await this.usersRepository.findOneBy({ email: passwordChangeRequest.email });
    if (!user) throw new InternalServerErrorException('The requested User was not available in the database.');

    // check if the new password is the same as the old one
    const samePassword = await bcrypt.compare(password, user.password);
    if (samePassword) {
      throw new BadRequestException('New password cannot be the same as the old one');
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update the user password
    user.password = hashedPassword;
    await this.usersRepository.save(user);

    // clear the reset token from the database
    await this.passwordChangeRequestRepo.remove(passwordChangeRequest);

    // Return success response
    return { message: 'Password reset successful' };
  }
}
