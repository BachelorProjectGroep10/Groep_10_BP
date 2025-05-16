import knex from '../../util/database';
import { Admin } from '../model/Admin';


export const getAdmin = async (Username: string): Promise<any> => {
    const row = await knex('Admin').where({ Username }).first();
    if (!row) return null;
    return new Admin({ ...row });
}