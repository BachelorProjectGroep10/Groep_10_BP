import express, { Request, Response, NextFunction } from 'express';
import UserService from '../service/user.service';

const userRouter = express.Router();

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body;
    await UserService.addUser(user);
    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    next(error);
  }
});

userRouter.delete('/:macAddress', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const macAddress = req.params.macAddress;
    await UserService.deleteUser(macAddress);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
})

export default userRouter;