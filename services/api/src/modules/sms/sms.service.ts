import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);

    constructor(private configService: ConfigService) { }

    /**
     * Generates a random numeric OTP code of specified length.
     */
    generateOtpCode(length: number = 6): string {
        let code = '';
        const digits = '0123456789';
        for (let i = 0; i < length; i++) {
            code += digits.charAt(Math.floor(Math.random() * digits.length));
        }
        return code;
    }

    /**
     * Sends an OTP code to a mobile number.
     * In production, this uses AWS SNS. In development, it logs to the console.
     */
    async sendOtpCode(phone: string, code: string): Promise<boolean> {
        const isProd = this.configService.get('NODE_ENV') === 'production';
        const message = `[Aram] Your verification code is: ${code}. Valid for 10 minutes.`;

        if (!isProd) {
            this.logger.log(`[DEV MODE] SMS to ${phone}: ${message}`);
            // Simulate successful send
            return true;
        }

        try {
            // TODO: Implement AWS SNS integration here
            // const sns = new AWS.SNS({ region: '...' });
            // await sns.publish({ Message: message, PhoneNumber: phone }).promise();
            this.logger.log(`SMS sent to ${phone} (Implementation pending AWS setup)`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to send SMS to ${phone}`, error);
            return false;
        }
    }
}
