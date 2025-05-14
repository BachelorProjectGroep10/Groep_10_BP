// backend/service/password.service.ts
import fs from 'fs';
import path from 'path';
import { Password } from '../domain/model/Password';

const PASSWORD_FILE = path.join(process.cwd(), 'data', 'wifiPassword.json');

const getLatestWifiPassword = async (): Promise<Password> => {
  if (!fs.existsSync(PASSWORD_FILE)) return new Password({ password: '' });

  const content = fs.readFileSync(PASSWORD_FILE, 'utf-8');
  const data = JSON.parse(content);

  return new Password({ password: data.password });
};

export default { getLatestWifiPassword };