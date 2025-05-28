import { Event } from '../model/Event';

// Get all events
const getEvents = async (name?: string): Promise<Event[]> => {
  try {
    // Placeholder: Return empty array until database is ready
    return [];
    
    // Once DB is ready, structure will look like this:
    /*
    let query = knex('events')
      .select('*');

    if (name) {
      query = query.where('eventName', 'like', `%${name}%`);
    }

    const rows = await query;
    return rows.map(row => new Event({
      id: row.id,
      eventName: row.eventName,
      password: row.password,
      startDate: new Date(row.startDate),
      endDate: new Date(row.endDate),
      description: row.description,
    }));
    */
    
  } catch (err) {
    console.error('DB error fetching events:', err);
    throw new Error('Fetch failed');
  }
};

// Insert an event
const insertEvent = async (event: Event): Promise<Event> => {
  // Simulate a transaction object
  const trx = {}; // Placeholder

  try {
    console.log('Simulating insert for event:', event.eventName);

    // If DB were set up, you'd use something like:
    /*
    const trx = await knex.transaction();

    const existingEvent = await trx('events').where('eventName', event.eventName).first();
    if (existingEvent) {
      await trx.rollback();
      throw new Error('Event already exists');
    }

    await trx('events').insert({
      eventName: event.eventName,
      password: event.password,
      startDate: event.startDate,
      endDate: event.endDate,
      description: event.description,
    });

    await trx.commit();
    */

    return event;

  } catch (err) {
    console.error('Simulated insert failed:', err);
    throw new Error('Insert failed');
  }
};

export { getEvents, insertEvent };