import express, { Request, Response, NextFunction } from 'express';
import EventService from '../service/event.service';
import { authorize } from '../util/authorize';

const eventRouter = express.Router();

eventRouter.get('/', authorize('Admin', 'Personnel'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await EventService.getAllEvents(req.query.name as string);
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
});

eventRouter.post('/', authorize('Admin', 'Personnel'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = req.body;
    await EventService.addEvent(event);
    res.status(201).json({ message: 'Event added successfully' });
  } catch (error) {
    next(error);
  }
});

eventRouter.put('/:eventName', authorize('Admin', 'Personnel'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventName = req.params.macAddress;
    const updates = req.body; 
    
    // await EventService.updateEventByName(eventName, updates);

    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    next(error);
  }
});

eventRouter.delete('/:eventName', authorize('Admin', 'Personnel'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventName = req.params.groupName;
    // await EventService.deleteEvent(eventName);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default eventRouter;