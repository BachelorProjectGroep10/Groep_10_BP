import jwt, { SignOptions } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
interface JwtPayloadInput {
    userId: string;
    username: string;
}

export const generateJwtToken = ({ userId, username }: JwtPayloadInput): string => {
    const expiresIn: SignOptions['expiresIn'] = '8h'; 
    const options: SignOptions = {
        expiresIn,
        issuer: "BPGroep10"
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }

    try {
        return jwt.sign({ userId, username }, secret, options);
    } catch (err) {
        console.error(err);
        throw new Error('Error generating JWT token, see server logs for details');
    }
};


const jwtSecret = process.env.JWT_SECRET!;
const AUTH_TOKEN_COOKIE = 'auth_token';

export const decodeToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies[AUTH_TOKEN_COOKIE];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    (req as any).user = decoded; // Attach decoded user to req
    next(); // Proceed to next middleware
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};


