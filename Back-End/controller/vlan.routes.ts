import express, { Request, Response, NextFunction } from 'express';
import vlanService from '../service/vlan.service';
import { authorize } from '../util/authorize';

const vlanRouter = express.Router();

vlanRouter.get('/', authorize('Admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vlans = await vlanService.getAllVlans();
    res.status(200).json(vlans);
  } catch (error) {
    next(error);
  }
});

export default vlanRouter;