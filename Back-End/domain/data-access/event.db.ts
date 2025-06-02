import { Event } from '../model/Event';

// In-memory test data
let testEvents: Event[] = [
  new Event({
    id: 1,
    eventName: 'Sample Event',
    password: 'abc123',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-02'),
    description: 'A sample test event',
  }),
  new Event({
    id: 2,
    eventName: 'Hackathon 2025',
    password: 'secure456',
    startDate: new Date('2025-07-10'),
    endDate: new Date('2025-07-12'),
    description: 'Annual tech hackathon for students and professionals.',
  }),
];

// Get all events
const getEvents = async (name?: string): Promise<Event[]> => {
  try {
    // Return filtered in-memory test data
    if (name) {
      return testEvents.filter(e =>
        e.eventName.toLowerCase().includes(name.toLowerCase())
      );
    }
    return testEvents;

    // Once DB is ready, structure will look like this:
    /*
    let query = knex('events').select('*');

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
  try {
    // Simulate uniqueness check
    const exists = testEvents.some(e => e.eventName === event.eventName);
    if (exists) throw new Error('Event already exists');

    testEvents.push(event);
    console.log('Inserted test event:', event);

    return event;

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
  } catch (err) {
    console.error('Simulated insert failed:', err);
    throw new Error('Insert failed');
  }
};

// Update event fields
const updateEventFields = async (eventName: string, updates: Partial<Event>): Promise<void> => {
  try {
    const index = testEvents.findIndex(e => e.eventName === eventName);
    if (index === -1) throw new Error('Event does not exist');

    const existing = testEvents[index];

    // Validate date fields
    if (updates.startDate && isNaN(new Date(updates.startDate).getTime())) {
      throw new Error("Invalid 'startDate'");
    }
    if (updates.endDate && isNaN(new Date(updates.endDate).getTime())) {
      throw new Error("Invalid 'endDate'");
    }

    testEvents[index] = new Event({
      ...existing,
      ...updates,
    });

    console.log(`Updated test event '${eventName}' with:`, updates);

    // If DB were set up, you'd do something like:
    /*
    const trx = await knex.transaction();

    const existingEvent = await trx('events').where('eventName', eventName).first();
    if (!existingEvent) {
      await trx.rollback();
      throw new Error('Event does not exist');
    }

    const updatePayload: Partial<Event> = {};
    if (updates.eventName && updates.eventName !== eventName) {
      updatePayload.eventName = updates.eventName;
    }
    if (updates.password !== undefined) {
      updatePayload.password = updates.password;
    }
    if (updates.startDate !== undefined) {
      updatePayload.startDate = updates.startDate;
    }
    if (updates.endDate !== undefined) {
      updatePayload.endDate = updates.endDate;
    }
    if (updates.description !== undefined) {
      updatePayload.description = updates.description;
    }

    if (Object.keys(updatePayload).length > 0) {
      await trx('events')
        .where('eventName', eventName)
        .update(updatePayload);
    }

    await trx.commit();
    */
  } catch (err) {
    console.error('Simulated error updating event:', err);
    throw new Error('Update failed');
  }
};

export { getEvents, insertEvent, updateEventFields };
