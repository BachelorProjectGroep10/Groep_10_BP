import express, { Request, Response, NextFunction } from 'express';
import UserService from '../service/user.service';

const userRouter = express.Router();

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.getAllUsers(
      req.query.macAddress as string, 
      req.query.email as string,
      req.query.uid as string
    );
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

userRouter.put('/:macAddress', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const macAddress = req.params.macAddress;
    const updates = req.body; 
    
    await UserService.updateUserByMac(macAddress, updates);

    res.status(200).json({ message: 'User updated successfully' });
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

userRouter.post('/regen/:macAddress', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const macAddress = req.params.macAddress;
    await UserService.regenUserPw(macAddress);
    res.status(200).json({ message: 'User password regenerated successfully' });
  } catch (error) {
    next(error);
  }
})

userRouter.post('/addToGroup/:macAddress', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const macAddress = req.params.macAddress;
    const groupName = req.body.groupName;
    await UserService.addUserToAGroup(macAddress, groupName);
    res.status(200).json({ message: 'User added to group successfully' });
  } catch (error) {
    next(error);
  }
})

userRouter.post('/removeFromGroup/:macAddress', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const macAddress = req.params.macAddress;
    const groupName = req.body.groupName;
    await UserService.removeUserFromAGroup(macAddress, groupName);
    res.status(200).json({ message: 'User removed from group successfully' });
  } catch (error) {
    next(error);
  }
})

export default userRouter;