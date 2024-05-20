import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
        private readonly configService: ConfigService
    ) { }

    async sendUserCredentials(user: User, password: string) {
        console.log(user.email, password);
        console.log(this.configService.get('MAIL_PASSWORD'))

        return await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome to Nepal Red Cross ! Confirm your Email',
            template: './sendUserCredentials', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                name: user.firstName + ' ' + user.lastName,
                email: user.email,
                password,
            },
        });
    }
}
