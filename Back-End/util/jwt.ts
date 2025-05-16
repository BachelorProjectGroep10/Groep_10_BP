import jwt, { SignOptions } from 'jsonwebtoken';

interface JwtPayloadInput {
    userId: string;
    username: string;
}

const generateJwtToken = ({ userId, username }: JwtPayloadInput): string => {
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

export {
    generateJwtToken
};
