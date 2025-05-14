import { Password } from '../domain/model/Password';
import { getCurrentPassword } from '../domain/data-access/password.db';

const getLatestWifiPassword = async (): Promise<Password> => {
  const password = await getCurrentPassword();
  return password ?? new Password({ password: '' });
};

export default { getLatestWifiPassword };