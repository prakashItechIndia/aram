import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as PDFDocument from 'pdfkit';

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
        <p>This link will expire in 5 minutes.</p>
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

  async sendDonationReceipt(
    email: string,
    name: string,
    donationDetails: {
      amount: number;
      receiptNo: string;
      date: string;
      type: string;
      email?: string;
      pan?: string;
      address?: string;
      phone?: string;
      eligible80G?: boolean;
    }
  ) {
    if (!this.transporter) return;
    const from = this.configService.get<string>('SMTP_FROM') || '"Aram Foundation" <no-reply@aram.org>';
    const subject = `Donation Receipt - ${donationDetails.receiptNo}`;

    // Generate PDF Buffer
    const pdfBuffer = await this.generateReceiptPDFBuffer(name, donationDetails);

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #F36A4F; text-align: center;">Thank You for Your Donation!</h2>
        <p>Hello ${name},</p>
        <p>We have successfully received your donation. Your contribution helps us continue our mission. Below are the details of your donation:</p>
        
        <div style="background-color: #F9F9F9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;">Receipt No:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${donationDetails.receiptNo}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Date:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${donationDetails.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Amount:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #F36A4F; font-size: 18px;">₹${donationDetails.amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Donation Type:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${donationDetails.type}</td>
            </tr>
          </table>
        </div>

        <p>We have attached your official receipt to this email. You can also download it at any time by logging into your portal.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${(this.configService.get<string>('FRONTEND_URL') || 'https://aram-donor.vercel.app').replace(/\/$/, '')}/home" 
             style="background-color: #F36A4F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
             Visit Donor Portal
          </a>
        </div>
        
        <br>
        <p style="font-size: 12px; color: #999; text-align: center;">
          This is an automated receipt for your records. If you have any questions, please contact us at support@aram.org
        </p>
      </div>
    `;
    try {
      await this.transporter.sendMail({
        from,
        to: email,
        subject,
        html,
        attachments: [
          {
            filename: `Receipt_${donationDetails.receiptNo}.pdf`,
            content: pdfBuffer,
          }
        ]
      });
      this.logger.log(`Donation receipt email sent to ${email} with attachment`);
    } catch (error) {
      this.logger.error(`Failed to send donation receipt email to ${email}`, error);
    }
  }

  private async generateReceiptPDFBuffer(name: string, details: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);

      // --- HEADER ---
      doc.fillColor('#F36A4F').fontSize(24).text('ARAM FOUNDATION', { align: 'center' });
      doc.fillColor('#666').fontSize(10).text('Email: info@aramfoundation.org | Web: www.aramfoundation.org', { align: 'center' });
      doc.moveDown();
      doc.strokeColor('#DBDBDB').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(2);

      // --- TITLE ---
      doc.fillColor('#000').fontSize(18).text('DONATION RECEIPT', { align: 'center' });
      doc.moveDown(2);

      // --- DONOR & RECEIPT INFO ---
      const topOfDetails = doc.y;

      // Left side: Donor
      doc.fontSize(11).fillColor('#666').text('Donor Details:');
      doc.fillColor('#000').font('Helvetica-Bold').text(name);
      doc.font('Helvetica').fontSize(10);
      if (details.email) doc.text(`Email: ${details.email}`);
      if (details.phone) doc.text(`Phone: ${details.phone}`);
      if (details.pan) doc.text(`PAN: ${details.pan}`);
      if (details.address) doc.text(`Address: ${details.address}`, { width: 250 });

      // Right side: Receipt (Reset Y to topOfDetails)
      const rightColX = 300;
      doc.y = topOfDetails;
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text(`Receipt No: ${details.receiptNo}`, rightColX, doc.y, { width: 250, align: 'right' });
      doc.font('Helvetica');
      doc.text(`Date: ${details.date}`, rightColX, doc.y + 2, { width: 250, align: 'right' });
      doc.text(`80G Eligible: ${details.eligible80G ? 'Yes' : 'No'}`, rightColX, doc.y + 2, { width: 250, align: 'right' });

      doc.moveDown(4);

      // --- TABLE HEADER ---
      const tableTop = doc.y;
      doc.fillColor('#F36A4F').rect(50, tableTop, 500, 25).fill();
      doc.fillColor('#FFF').font('Helvetica-Bold').fontSize(11);
      doc.text('Description', 70, tableTop + 7);
      doc.text('Amount', 300, tableTop + 7, { width: 230, align: 'right' });

      // --- TABLE BODY ---
      doc.fillColor('#000').font('Helvetica').fontSize(10);
      doc.text(details.type, 70, tableTop + 35);
      doc.text(`INR ${details.amount.toLocaleString()}`, 300, tableTop + 35, { width: 230, align: 'right' });

      doc.strokeColor('#DBDBDB').moveTo(50, tableTop + 55).lineTo(550, tableTop + 55).stroke();

      // --- TOTAL ---
      doc.moveDown(4);
      doc.font('Helvetica-Bold').fontSize(14).text(`Total Amount: INR ${details.amount.toLocaleString()}`, 300, doc.y, { width: 250, align: 'right' });

      // --- FOOTER ---
      doc.moveDown(4);
      doc.font('Helvetica').fontSize(9).fillColor('#999');
      const note = details.eligible80G
        ? 'This is a computer generated receipt and does not require a physical signature. Your donation is eligible for 80G tax exemption.'
        : 'This is a computer generated receipt and does not require a physical signature.';
      doc.text(note, 50, doc.y, { width: 500, align: 'center' });

      doc.end();
    });
  }
}
