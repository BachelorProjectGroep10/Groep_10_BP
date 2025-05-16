import express, { Request, Response, NextFunction } from 'express';
import AdminService from '../service/admin.service';

const adminRouter = express.Router();

adminRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const adminData = await AdminService.authenticate( { username, password });
    res.status(200).json(adminData);
  } catch (error) {
    next(error);
  }
});

export default adminRouter;