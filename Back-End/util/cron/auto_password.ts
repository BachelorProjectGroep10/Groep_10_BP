import cron from 'node-cron';
import { insertPassword } from '../../domain/data-access/password.db';
import { generateWeeklyPassword, getISOWeekNumber } from '../../util/autoPassword';

const SCHEDULE_EVERY_5_HOURS = '0 */5 * * *';
const EXECUTE_IMMEDIATELY = false;

const SEED = process.env.SEED_PASSWORD!;
if (!SEED) {
  throw new Error('SEED_PASSWORD environment variable is required');
}

export default class AutoPasswordCron {
  init = async () => {
    if (EXECUTE_IMMEDIATELY) {
      await this.generateAndStorePassword();
    }

    cron.schedule(SCHEDULE_EVERY_5_HOURS, async () => {
      await this.generateAndStorePassword();
    });

    console.log('Auto-password cron initialized...');
  };

  generateAndStorePassword = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const week = getISOWeekNumber(new Date());

    const password = generateWeeklyPassword(SEED, year, week);

    try {
      await insertPassword(password);
      console.log(`[auto-password] Password for year ${year} week ${week} saved to database`);
    } catch (err) {
      console.error('[auto-password] Failed to insert password into DB:', err);
    }
  };
}
