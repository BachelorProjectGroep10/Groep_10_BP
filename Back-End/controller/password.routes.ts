// backend/controller/password.routes.ts
import express, { Request, Response, NextFunction } from 'express';
import PasswordService from '../service/password.service';

const passwordRouter = express.Router();

passwordRouter.get('/', async (req:Request, res: Response, next: NextFunction) => {
  try {
    const password = await PasswordService.getLatestWifiPassword();
    res.status(200).json(password);
  } catch (error) {
    next(error);
  }
});

export default passwordRouter;
