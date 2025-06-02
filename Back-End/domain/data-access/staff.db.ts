import knex from '../../util/database';
import { Staff } from '../model/Staff';


export const getStaff = async (Username: string): Promise<any> => {
    const row = await knex('staff').where({ Username }).first();
    if (!row) return null;
    return new Staff({ ...row });
}

export const getStaffByMail = async (email: string): Promise<any> => {
    const row = await knex('staff').where({ Email: email }).first();
    if (!row) return null;
    return new Staff({ ...row });
}