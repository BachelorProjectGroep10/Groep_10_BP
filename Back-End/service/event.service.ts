import { deleteEventFromDB, getEvents, insertEvent } from "../domain/data-access/event.db";
import { Event } from "../domain/model/Event";

const getAllEvents = async (name:string): Promise<Event[]> => {
    const events = await getEvents(name);
    return events.map(event => {
        return new Event({
            eventName: event.eventName,
            password: event.password,
            startDate: event.startDate,
            endDate: event.endDate,
            description: event.description
        });
    });
};

const addEvent = async (event: Event): Promise<void> => {
    const newEvent = new Event({
        eventName: event.eventName,
        password: event.password,
        startDate: event.startDate,
        endDate: event.endDate,
        description: event.description
    });
    await insertEvent(newEvent);
}

const updateEventByName = async (eventName: string, updates: Partial<Event>): Promise<void> => {
  if (updates.eventName) {
    throw new Error('Group name cannot be changed');
  }

  if (updates.startDate && isNaN(new Date(updates.startDate).getTime())) {
    throw new Error("Invalid startDate");
  }

  if (updates.endDate && isNaN(new Date(updates.endDate).getTime())) {
    throw new Error("Invalid endDate");
  }

  await updateEventByName(eventName, updates);
};

const deleteEvent = async (eventName: string): Promise<void> => {
    await deleteEventFromDB(eventName);
}


export default { getAllEvents, addEvent, updateEventByName, deleteEvent };