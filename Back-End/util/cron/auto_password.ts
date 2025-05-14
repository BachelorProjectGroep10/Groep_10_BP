import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { insertPassword } from '../../domain/data-access/password.db';

const SCHEDULE_EVERY_5_MIN = '*/5 * * * *'; // every 5 minutes
const EXECUTE_IMMEDIATELY = false;

function generateAsciiPassword(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export default class AutoPasswordCron {
  init = async () => {
    if (EXECUTE_IMMEDIATELY) {
      await this.generateAndStorePassword();
    }

    cron.schedule(SCHEDULE_EVERY_5_MIN, async () => {
      await this.generateAndStorePassword();
    });

    console.log('Auto-password cron initialized...');
  };

  generateAndStorePassword = async () => {
    const password = generateAsciiPassword();

    try {
      await insertPassword(password);
      console.log(`[auto-password] Password saved to database`);
    } catch (err) {
      console.error('[auto-password] Failed to insert password into DB:', err);
    }
  };
}
