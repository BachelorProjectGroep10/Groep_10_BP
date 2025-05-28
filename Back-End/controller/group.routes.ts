import express, { Request, Response, NextFunction } from 'express';
import GroupService from '../service/group.service';

const groupRouter = express.Router();

groupRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await GroupService.getAllGroups(req.query.name as string, req.query.vlan as unknown as number);
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

groupRouter.delete('/:groupName', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groupName = req.params.groupName;
    await GroupService.deleteGroup(groupName);
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    next(error);
  }
});

groupRouter.post('/regen/:groupName', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groupName = req.params.groupName;
    await GroupService.regenGroupPW(groupName);
    res.status(200).json({ message: 'Group password regenerated successfully' });
  } catch (error) {
    next(error);
  }
})

export default groupRouter;