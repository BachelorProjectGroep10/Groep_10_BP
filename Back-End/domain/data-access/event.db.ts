import knex from '../../util/database';
import { Event } from '../model/Event';

// Get all events
const getEvents = async (name?: string): Promise<Event[]> => {
  try {
    let query = knex('event')
      .select(
        'event.*'
      )

    if (name) {
      query = query.andWhere('event.name', 'like', `%${name}%`);
    }

    const rows = await query;

    return rows.map((row) => {
          // Make the password logic here          
          const passwords: string[] = [];
    
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

    const startDateFormatted = new Date(event.startDate).toISOString().slice(0, 19).replace('T', ' ');
    const endDateFormatted = new Date(event.endDate).toISOString().slice(0, 19).replace('T', ' ');


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


// // Update event fields
// const updateEventFields = async (eventName: string, updates: Partial<Event>): Promise<void> => {
//   try {
//     const index = testEvents.findIndex(e => e.eventName === eventName);
//     if (index === -1) throw new Error('Event does not exist');

//     const existing = testEvents[index];

//     // Validate date fields
//     if (updates.startDate && isNaN(new Date(updates.startDate).getTime())) {
//       throw new Error("Invalid 'startDate'");
//     }
//     if (updates.endDate && isNaN(new Date(updates.endDate).getTime())) {
//       throw new Error("Invalid 'endDate'");
//     }

//     testEvents[index] = new Event({
//       ...existing,
//       ...updates,
//     });

//     console.log(`Updated test event '${eventName}' with:`, updates);

//     // If DB were set up, you'd do something like:
//     /*
//     const trx = await knex.transaction();

//     const existingEvent = await trx('events').where('eventName', eventName).first();
//     if (!existingEvent) {
//       await trx.rollback();
//       throw new Error('Event does not exist');
//     }

//     const updatePayload: Partial<Event> = {};
//     if (updates.eventName && updates.eventName !== eventName) {
//       updatePayload.eventName = updates.eventName;
//     }
//     if (updates.password !== undefined) {
//       updatePayload.password = updates.password;
//     }
//     if (updates.startDate !== undefined) {
//       updatePayload.startDate = updates.startDate;
//     }
//     if (updates.endDate !== undefined) {
//       updatePayload.endDate = updates.endDate;
//     }
//     if (updates.description !== undefined) {
//       updatePayload.description = updates.description;
//     }

//     if (Object.keys(updatePayload).length > 0) {
//       await trx('events')
//         .where('eventName', eventName)
//         .update(updatePayload);
//     }

//     await trx.commit();
//     */
//   } catch (err) {
//     console.error('Simulated error updating event:', err);
//     throw new Error('Update failed');
//   }
// };

// // Delete event by eventName
// const deleteEventFromDB = async (eventName: string): Promise<void> => {
//   try {
//     const index = testEvents.findIndex(e => e.eventName === eventName);
//     if (index === -1) {
//       throw new Error('Event does not exist');
//     }
    
//     // Remove the event from the in-memory array
//     testEvents.splice(index, 1);
    
//     console.log(`Deleted event '${eventName}' successfully`);

//     // When DB is ready, use something like this:
//     /*
//     const trx = await knex.transaction();

//     const existingEvent = await trx('events').where('eventName', eventName).first();
//     if (!existingEvent) {
//       await trx.rollback();
//       throw new Error('Event does not exist');
//     }

//     await trx('events').where('eventName', eventName).del();

//     await trx.commit();
//     console.log(`Deleted event '${eventName}' from DB successfully`);
//     */
//   } catch (err) {
//     console.error('Simulated error deleting event:', err);
//     throw new Error('Delete failed');
//   }
// };


export { getEvents, insertEvent /*, updateEventFields, deleteEventFromDB */};
