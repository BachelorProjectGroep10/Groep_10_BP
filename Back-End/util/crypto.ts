import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex')

export function encryptPassword(password: string): { encrypted: string; iv: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return { encrypted, iv: iv.toString('hex') };
}

export function decryptPassword(encrypted: string, ivHex: string): string {
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
