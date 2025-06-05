import cron from 'node-cron';
import { insertPassword } from '../../domain/data-access/password.db';
import { generateWeeklyPassword } from '../../util/autoPassword';

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
    const week = getCurrentISOWeekNumber();

    const password = generateWeeklyPassword(SEED, year, week);

    try {
      await insertPassword(password);
      console.log(`[auto-password] Password for year ${year} week ${week} saved to database`);
    } catch (err) {
      console.error('[auto-password] Failed to insert password into DB:', err);
    }
  };
}

// Weeknummer volgens ISO (maandag = eerste dag)
export function getCurrentISOWeekNumber(): number {
  const now = new Date();
  const target = new Date(now.valueOf());
  const dayNr = (now.getDay() + 6) % 7;

  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();

  const jan1 = new Date(target.getFullYear(), 0, 1);
  const jan1Day = (jan1.getDay() + 6) % 7;
  const jan1Thursday = jan1.valueOf() + (3 - jan1Day) * 24 * 60 * 60 * 1000;

  return 1 + Math.round((firstThursday - jan1Thursday) / (7 * 24 * 60 * 60 * 1000));
}
