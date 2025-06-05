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