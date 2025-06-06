import { Event } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

const getEvents = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();

    const url = `${basicUrl}/event${queryString ? `?${queryString}` : ''}`;

    return fetch(url, {
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

const updateEvent = async (eventName: string, updates: Partial<Event>) => {
  const token = sessionStorage.getItem("token") || "";
  const response = await fetch(`${basicUrl}/event/${eventName}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Update failed (${response.status}): ${errorText}`);
  }

  return response.json();
};

const deleteEvent = async (eventName: string) => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/event/${eventName}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        credentials: 'include'
    });
}

const EventService = {
    getEvents,
    addEvent,
    updateEvent,
    deleteEvent
};

export default EventService;