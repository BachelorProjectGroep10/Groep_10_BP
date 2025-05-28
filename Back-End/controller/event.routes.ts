import express, { Request, Response, NextFunction } from 'express';
import EventService from '../service/event.service';

const eventRouter = express.Router();

eventRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await EventService.getAllEvents(req.query.name as string);
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
});

eventRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = req.body;
    await EventService.addEvent(event);
    res.status(201).json({ message: 'Event added successfully' });
  } catch (error) {
    next(error);
  }
});

export default eventRouter;