import { generateWeeklyPassword, getISOWeekNumber } from '../../util/autoPassword';
import knex from '../../util/database';
import { formatDateLocal, parseDateLocal } from '../../util/dateFormatter';
import { Event } from '../model/Event';

const SEED = process.env.SEED_PASSWORD!;
if (!SEED) {
  throw new Error('SEED_PASSWORD environment variable is required');
}

// Get all events
const getEvents = async (name?: string): Promise<Event[]> => {
  try {
    let query = knex('event').select('event.*');

    if (name) {
      query = query.andWhere('event.name', 'like', `%${name}%`);
    }

    const rows = await query;
    const today = new Date();
    const currentWeek = getISOWeekNumber(today);
    const currentYear = today.getFullYear();

    return rows.map((row) => {
      const passwords: {
        value: string;
        week: number;
        year: number;
        validNow: boolean;
      }[] = [];

      const start = parseDateLocal(row.startDate);
      const end = parseDateLocal(row.endDate);

      let cursor = start

      // Normalize cursor to start of the ISO week (Monday)
      cursor.setDate(cursor.getDate() - ((cursor.getDay() + 6) % 7));

      while (
        cursor <= end
      ) {
        const year = cursor.getFullYear();
        const week = getISOWeekNumber(cursor);
        const value = generateWeeklyPassword(SEED, year, week);
        const validNow = year === currentYear && week === currentWeek;

        // Avoid duplicates in case of overlap
        if (!passwords.some(p => p.week === week && p.year === year)) {
          passwords.push({ value, week, year, validNow });
        }

        // Advance to next ISO week
        cursor.setDate(cursor.getDate() + 7);
      }

      return new Event({
        id: row.id,
        eventName: row.name,
        password: passwords,
        startDate: row.startDate,
        endDate: row.endDate,
        description: row.description
      });
    });
  } catch (err) {
    console.error('DB error fetching events:', err);
    throw new Error('Fetch failed');
  }
};

// Insert an event
const insertEvent = async (event: Event): Promise<Event> => {
  const trx = await knex.transaction();

  try {
    const checkEvent = await trx('event').where('name', event.eventName).first();
    
    if (checkEvent) {
      console.error('Event already exists');
      await trx.rollback();
      throw new Error('Event already exists');
    }

    const startDateFormatted = formatDateLocal(event.startDate);
    const endDateFormatted = formatDateLocal(event.endDate);

    await trx('event').insert({
      name: event.eventName,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
      description: event.description
    });

    await trx.commit();
    console.log('Event inserted successfully');

    return event;
  } catch (err) {
    await trx.rollback();
    console.error('DB error inserting event:', err);
    throw new Error('Insert failed');
  }
};


// Update event fields
const updateEventFields = async (eventName: string, updates: Partial<Event>): Promise<void> => {
  const trx = await knex.transaction();

  try {
    const existingEvent = await trx('event').where('name', eventName).first();
    if (!existingEvent) {
      await trx.rollback();
      throw new Error('Event does not exist');
    }

    const updatePayload: Record<string, any> = {};

    if (updates.eventName && updates.eventName !== eventName) {
      updatePayload.name = updates.eventName;
    }
    if (updates.startDate !== undefined) {
      updatePayload.startDate = formatDateLocal(updates.startDate);
    }
    if (updates.endDate !== undefined) {
      updatePayload.endDate = formatDateLocal(updates.endDate);
    }
    if (updates.description !== undefined) {
      updatePayload.description = updates.description;
    }

    if (Object.keys(updatePayload).length > 0) {
      await trx('event')
        .where('name', eventName)
        .update(updatePayload);
    }

    await trx.commit();
  } catch (err) {
    await trx.rollback();
    console.error('DB error updating event:', err);
    throw new Error('Update failed');
  }
};

// Delete event by eventName
const deleteEventFromDB = async (eventName: string): Promise<void> => {
  const trx = await knex.transaction();

  try {
    const existingEvent = await trx('event').where('name', eventName).first();
    if (!existingEvent) {
      await trx.rollback();
      throw new Error('Event does not exist');
    }

    await trx('event').where('name', eventName).del();

    await trx.commit();
    console.log(`Deleted event '${eventName}' from DB successfully`);
  } catch (err) {
    await trx.rollback();
    console.error('DB error deleting event:', err);
    throw new Error('Delete failed');
  }
};


export { getEvents, insertEvent, updateEventFields, deleteEventFromDB };
