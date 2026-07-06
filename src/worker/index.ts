// Bağımsız process — `npm run worker` (tsx watch) ile çalışır. Next dışında
// olduğu için .env otomatik yüklenmez, bu yüzden dotenv/config ilk satır olmalı.
import 'dotenv/config';
import { Worker } from 'bullmq';
import { redisConnection } from '../lib/redis';
import { EMAIL_QUEUE_NAME, type EmailJobData } from '../lib/queue';
import { mailer } from './mailer';

const FROM =
  process.env.SMTP_FROM ?? 'Kütahya Satılık Tarla <no-reply@kutahyasatiliktarla.com>';

const worker = new Worker<EmailJobData>(
  EMAIL_QUEUE_NAME,
  async (job) => {
    const { data } = job;
    const subject =
      data.kind === 'verify-email'
        ? 'E-posta adresinizi doğrulayın'
        : 'Şifre sıfırlama talebi';
    const html = `<p>Merhaba ${data.name ?? ''},</p><p><a href="${data.url}">${subject}</a></p>`;
    await mailer.sendMail({ from: FROM, to: data.to, subject, html });
  },
  { connection: redisConnection, concurrency: 5 },
);

worker.on('completed', (job) =>
  console.log(`[worker] ${job.data.kind} → ${job.data.to} (job ${job.id}) gönderildi`),
);
worker.on('failed', (job, err) =>
  console.error(`[worker] job ${job?.id} başarısız:`, err),
);

console.log('[worker] email worker başlatıldı, kuyruk:', EMAIL_QUEUE_NAME);
