import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendUserCredentials() {

        return await this.mailerService.sendMail({
            to: 'predatorprakash007@gmail.com',
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to Nice App! Confirm your Email',
            template: './sendUserCredentials', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                name: "prakash banjade",
                email: "prakashbanjade191@gmail.com",
            },
        });
    }
}
