import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import * as nodemailer from 'nodemailer';
import { Donor } from 'src/donors/entities/donor.entity';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
        private readonly configService: ConfigService
    ) { }

    async sendUserCredentials(user: User, password: string) {
        const result = await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome to Nepal Red Cross ! Confirm your Email',
            template: './sendUserCredentials', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                name: user.firstName + ' ' + user.lastName,
                email: user.email,
                password,
            },
        });

        const previewUrl = nodemailer.getTestMessageUrl(result);
        console.log('Preview URL:', previewUrl);

        return result;
    }

    async sendResetPasswordLink(user: User, resetToken: string) {
        const result = await this.mailerService.sendMail({
            to: user.email,
            subject: 'Reset your password',
            template: './sendResetPasswordLink', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                name: user.firstName + ' ' + user.lastName,
                resetLink: `${this.configService.get('CLIENT_URL')}/reset-password/${resetToken}`,
            },
        });

        const previewUrl = nodemailer.getTestMessageUrl(result);
        console.log('Preview URL:', previewUrl);

        return { result, previewUrl };
    }

    async wishBirthday(donor: Donor) {
        if (!donor.email) return;

        const result = await this.mailerService.sendMail({
            to: donor.email,
            subject: 'Happy Birthday',
            template: './birthdayTemplate', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                name: donor.firstName + ' ' + donor.lastName,
            },
        });

        const previewUrl = nodemailer.getTestMessageUrl(result);
        console.log('Preview URL:', previewUrl);

        return { result, previewUrl };
    }
}