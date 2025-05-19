import express, { Request, Response, NextFunction } from 'express';
import GroupService from '../service/group.service';

const groupRouter = express.Router();

groupRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await GroupService.getAllGroups();
    res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
});

groupRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = req.body;
    await GroupService.addGroup(group);
    res.status(201).json({ message: 'Group added successfully' });
  } catch (error) {
    next(error);
  }
});

export default groupRouter;