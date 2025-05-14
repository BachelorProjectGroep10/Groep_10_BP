import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

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
    const data = {
      password,
      updatedAt: new Date().toISOString(),
    };

    const outputPath = path.join(process.cwd(), 'data', 'wifiPassword.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log(`[auto-password] New password generated: ${password}`);
  };
}
