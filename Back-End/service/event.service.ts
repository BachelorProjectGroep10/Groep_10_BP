import { getEvents, insertEvent } from "../domain/data-access/event.db";
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

export default { getAllEvents, addEvent };