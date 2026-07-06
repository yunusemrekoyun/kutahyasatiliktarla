import { Queue } from 'bullmq';
import { redisConnection } from './redis';

export const EMAIL_QUEUE_NAME = 'email';

export type EmailJobData =
  | { kind: 'verify-email'; to: string; url: string; name?: string }
  | { kind: 'reset-password'; to: string; url: string; name?: string };

export type EmailJobName = 'verify-email' | 'reset-password';

export const emailQueue = new Queue<EmailJobData, void, EmailJobName>(EMAIL_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});
