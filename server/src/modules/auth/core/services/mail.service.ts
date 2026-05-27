import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.get<string>('MAIL_USER'),
        pass: config.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    const mailOptions = {
      from: this.config.get<string>('MAIL_FROM'),
      to,
      subject: 'Restablecer contraseña — ReConecta45',
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
          <h2 style="color: #111827; margin-top: 0;">Restablecer contraseña</h2>
          <p style="color: #6b7280;">Recibimos una solicitud para restablecer la contraseña de tu cuenta en ReConecta45.</p>
          <p style="color: #6b7280;">Este enlace expira en <strong>1 hora</strong>.</p>
          <a href="${resetUrl}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Restablecer contraseña
          </a>
          <p style="color: #9ca3af; font-size: 13px;">Si no solicitaste este cambio, ignorá este email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="color: #9ca3af; font-size: 12px;">ReConecta45 — Reconectando profesionales +45 con el mercado laboral</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Reset email sent to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}`, err);
      throw err;
    }
  }
}
