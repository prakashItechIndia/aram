import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.createTransporter();
  }

  private createTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASSWORD');
    const secure = this.configService.get<string>('SMTP_SECURE') === 'true';

    if (!host || !user || !pass) {
        this.logger.warn('SMTP configuration missing, email service disabled.');
        return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    this.verifyConnection();
  }

  private async verifyConnection() {
    if (!this.transporter) return;
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection established successfully');
    } catch (error) {
      this.logger.error('SMTP connection failed', error);
    }
  }

  async sendGuestWelcome(email: string, name: string, tempPass: string) {
    if (!this.transporter) return;
    const from = this.configService.get<string>('SMTP_FROM') || '"Aram Support" <no-reply@aram.org>';
    const subject = 'Your Temporary Password - Aram Donor Portal';
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Welcome to Aram Donor Portal</h2>
        <p>Hello ${name},</p>
        <p>Thank you for your donation! We have created an account for you to track your donations and download receipts.</p>
        <p>Your temporary password is:</p>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 18px; font-weight: bold; letter-spacing: 1px; display: inline-block;">
            ${tempPass}
        </div>
        <p>Please use this password to login.</p>
        <br>
        <p>Regards,<br>Aram Team</p>
      </div>
    `;
    try {
      await this.transporter.sendMail({ from, to: email, subject, html });
      this.logger.log(`Guest welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send guest email to ${email}`, error);
    }
  }

  async sendResetLink(email: string, name: string, link: string) {
    if (!this.transporter) return;
    const from = this.configService.get<string>('SMTP_FROM') || '"Aram Support" <no-reply@aram.org>';
    const subject = 'Reset Your Password - Aram Donor Portal';
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Reset Password</h2>
        <p>Hello ${name},</p>
        <p>You requested to reset your password.</p>
        <p>Click the link below to set a new password:</p>
        <p><a href="${link}" style="color: #F36A4F; font-weight: bold;">Reset Password</a></p>
        <p>Or copy this link: ${link}</p>
        <p>This link will expire in 1 hour.</p>
        <br>
        <p>Regards,<br>Aram Team</p>
      </div>
    `;
    try {
      await this.transporter.sendMail({ from, to: email, subject, html });
      this.logger.log(`Reset link email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send reset link to ${email}`, error);
    }
  }

  /**
   * Send invitation email to new admin user with temporary password.
   */
  async sendAdminInvite(email: string, name: string, tempPass: string) {
    if (!this.transporter) {
      throw new Error('SMTP not configured');
    }
    const from = this.configService.get<string>('SMTP_FROM') || '"Aram Foundation Admin" <no-reply@aram.org>';
    const subject = 'Your Aram Foundation Admin Portal Account';
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Welcome to Aram Foundation Admin Portal</h2>
        <p>Hello ${name},</p>
        <p>An admin account has been created for you.</p>
        <p>Your temporary password is:</p>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 18px; font-weight: bold; letter-spacing: 1px; display: inline-block;">
            ${tempPass}
        </div>
        <p>Please use this password to log in and change it after your first login.</p>
        <br>
        <p>Regards,<br>Aram Foundation Team</p>
      </div>
    `;
    await this.transporter.sendMail({ from, to: email, subject, html });
    this.logger.log(`Admin invite email sent to ${email}`);
  }

  /**
   * Send a template-based email (e.g. for test send from Communication Templates).
   * Body is treated as plain text and wrapped in a simple HTML div.
   */
  async sendTemplate(to: string, subject: string, body: string) {
    if (!this.transporter) {
      throw new Error('SMTP not configured');
    }
    const from = this.configService.get<string>('SMTP_FROM') || '"Aram Foundation" <no-reply@aram.org>';
    const html = `<div style="font-family: Arial, sans-serif; color: #333; white-space: pre-wrap;">${body.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
    await this.transporter.sendMail({ from, to, subject, html });
    this.logger.log(`Template email sent to ${to}`);
  }
}
