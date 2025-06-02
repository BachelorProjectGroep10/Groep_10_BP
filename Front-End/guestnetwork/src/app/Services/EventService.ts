import { Event } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

const getEvents = async () => {
    return fetch(`${basicUrl}/event`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
}

const addEvent = async (event: Event) => {
    return fetch(`${basicUrl}/event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(event)
    });
}


const EventService = {
    getEvents,
    addEvent
};

export default EventService;