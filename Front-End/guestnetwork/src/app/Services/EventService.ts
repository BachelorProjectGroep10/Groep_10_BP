import { Event } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

const getEvents = async () => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/event`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`       
        }
    });
}

const addEvent = async (event: Event) => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(event)
    });
}


const EventService = {
    getEvents,
    addEvent
};

export default EventService;