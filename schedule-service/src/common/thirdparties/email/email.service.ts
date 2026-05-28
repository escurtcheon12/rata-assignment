import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface EmailPayload {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.password'),
      },
    });
  }

  async sendEmail(payload: EmailPayload): Promise<boolean> {
    this.logger.log(`Sending email to ${payload.to}: ${payload.subject}`);
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('email.user'),
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      });
      this.logger.log(`Email sent successfully to ${payload.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${(error as Error).message}`);
      return false;
    }
  }

  async sendScheduleCreatedEmail(
    customerEmail: string,
    customerName: string,
    scheduleDetails: {
      id: string;
      objective: string;
      doctorName: string;
      scheduledAt: Date;
    },
  ): Promise<boolean> {
    const subject = 'Schedule Created - Appointment Confirmation';
    const text = `
Dear ${customerName},

Your appointment has been successfully scheduled.

Details:
- Schedule ID: ${scheduleDetails.id}
- Objective: ${scheduleDetails.objective}
- Doctor: ${scheduleDetails.doctorName}
- Date & Time: ${scheduleDetails.scheduledAt.toISOString()}

Thank you for your booking.

Best regards,
Schedule Service
    `.trim();

    return this.sendEmail({ to: customerEmail, subject, text });
  }

  async sendScheduleDeletedEmail(
    customerEmail: string,
    customerName: string,
    scheduleDetails: {
      id: string;
      objective: string;
      doctorName: string;
      scheduledAt: Date;
    },
  ): Promise<boolean> {
    const subject = 'Schedule Cancelled - Appointment Cancellation';
    const text = `
Dear ${customerName},

Your appointment has been cancelled.

Cancelled Details:
- Schedule ID: ${scheduleDetails.id}
- Objective: ${scheduleDetails.objective}
- Doctor: ${scheduleDetails.doctorName}
- Original Date & Time: ${scheduleDetails.scheduledAt.toISOString()}

If you need to reschedule, please create a new appointment.

Best regards,
Schedule Service
    `.trim();

    return this.sendEmail({ to: customerEmail, subject, text });
  }
}
