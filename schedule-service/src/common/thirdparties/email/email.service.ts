import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import moment from 'moment';

export interface EmailPayload {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface ScheduleDetail {
  objective: string;
  doctorName: string;
  scheduledAt: Date;
}

export interface PayloadSchedule extends ScheduleDetail {
  email: string;
  name: string;
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

  async sendEmail(payload: EmailPayload) {
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
    } catch (error) {
      this.logger.error(`Failed to send email: ${(error as Error).message}`);
    }
  }

  async sendScheduleCreatedEmail(payload: PayloadSchedule) {
    const subject = 'Jadwal Dikonfirmasi - Pemberitahuan Janji Temu Baru';
    const text = `
    Yth. ${payload.name},

    Janji temu Anda telah berhasil dibuat.

    Detail Janji Temu:
    - Tujuan Kunjungan : ${payload.objective}
    - Dokter           : ${payload.doctorName}
    - Tanggal & Waktu  : ${moment(payload.scheduledAt).locale('id').format('D MMMM YYYY HH:mm')}

    Terima kasih telah melakukan pemesanan. Mohon hadir tepat waktu.

    Hormat kami,
    Layanan Jadwal
  `.trim();
    return this.sendEmail({ to: payload.email, subject, text });
  }

  async sendScheduleDeletedEmail(payload: PayloadSchedule) {
    const subject = 'Jadwal Dibatalkan - Pemberitahuan Pembatalan Janji Temu';
    const text = `
    Yth. ${payload.name},

    Kami informasikan bahwa janji temu Anda telah dibatalkan.

    Detail Pembatalan:
    - Tujuan Kunjungan : ${payload.objective}
    - Dokter           : ${payload.doctorName}
    - Tanggal & Waktu  : ${moment(payload.scheduledAt).locale('id').format('D MMMM YYYY HH:mm')}

    Apabila Anda ingin membuat jadwal baru, silakan buat janji temu kembali melalui aplikasi kami.

    Hormat kami,
    Layanan Jadwal
  `.trim();

    return this.sendEmail({ to: payload.email, subject, text });
  }
}
