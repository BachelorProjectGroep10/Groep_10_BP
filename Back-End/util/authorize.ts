import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET!;
const AUTH_TOKEN_COOKIE = 'auth_token';

interface AuthRequest extends Request {
  user?: { role?: string };
}

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies[AUTH_TOKEN_COOKIE];

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as { role?: string };

      (req as AuthRequest).user = decoded;

      if (!decoded.role) {
        res.status(401).json({ message: 'Unauthorized: No role found' });
        return;
      }

      if (!allowedRoles.includes(decoded.role)) {
        res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        return;
      }

      next(); // ✅ Proceed if role is allowed
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
  };
};