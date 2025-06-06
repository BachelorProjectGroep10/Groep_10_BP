import crypto from 'crypto';

// Helper function to generate random 8 letter ASCII password
export function generateRandomPassword(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Helper function to generate a weekly password
export function generateWeeklyPassword(seed: string, year: number, isoWeekNumber: number, length = 8): string {
  const input = `${seed}-${year}-W${String(isoWeekNumber).padStart(2, '0')}`;
  const hash = crypto.createHash('sha256').update(input).digest('hex');

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const byte = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
    password += chars.charAt(byte % chars.length);
  }

  return password;
}

// Weeknummer volgens ISO (maandag = eerste dag)
export function getISOWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;

  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();

  const jan1 = new Date(target.getFullYear(), 0, 1);
  const jan1Day = (jan1.getDay() + 6) % 7;
  const jan1Thursday = jan1.valueOf() + (3 - jan1Day) * 24 * 60 * 60 * 1000;

  return 1 + Math.round((firstThursday - jan1Thursday) / (7 * 24 * 60 * 60 * 1000));
}