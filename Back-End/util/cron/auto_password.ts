import cron from 'node-cron';
import { insertPassword } from '../../domain/data-access/password.db';
import { generateRandomPassword } from '../../util/autoPassword';

const SCHEDULE_EVERY_60_MIN = '*/60 * * * *'; // every 60 minutes
const EXECUTE_IMMEDIATELY = false;

export default class AutoPasswordCron {
  init = async () => {
    if (EXECUTE_IMMEDIATELY) {
      await this.generateAndStorePassword();
    }

    cron.schedule(SCHEDULE_EVERY_60_MIN, async () => {
      await this.generateAndStorePassword();
    });

    console.log('Auto-password cron initialized...');
  };

  generateAndStorePassword = async () => {
    const password = generateRandomPassword();

    try {
      await insertPassword(password);
      console.log(`[auto-password] Password saved to database`);
    } catch (err) {
      console.error('[auto-password] Failed to insert password into DB:', err);
    }
  };
}
