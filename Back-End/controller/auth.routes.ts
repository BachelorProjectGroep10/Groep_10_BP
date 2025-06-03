import express, { Request, Response, NextFunction } from 'express';
import { Issuer, generators, Client } from 'openid-client';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import authService from '../service/auth.service';
import { promises } from 'dns';
import { error } from 'console';

const authRouter = express.Router();
authRouter.use(cookieParser());

// === Constants ===
const tenantId = process.env.AZURE_TENANT_ID!;
const clientId = process.env.AZURE_CLIENT_ID!;
const clientSecret = process.env.AZURE_CLIENT_SECRET!;
const jwtSecret = process.env.JWT_SECRET!;
const redirectUri = process.env.REDIRECT_URI!;
const dashboardRedirectUri = 'http://localhost:8080/dashboard/';

const AUTH_STATE_COOKIE = 'auth_state';
const AUTH_NONCE_COOKIE = 'auth_nonce';
const AUTH_TOKEN_COOKIE = 'auth_token';

let client: Client;

// === Initialize OpenID Client ===
async function initializeClient() {
    try {
        const issuer = await Issuer.discover(`https://login.microsoftonline.com/${tenantId}/v2.0`);
        client = new issuer.Client({
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uris: [redirectUri],
            response_types: ['code'],
        });
        console.log('OIDC client initialized');
    } catch (err) {
        console.error('Failed to initialize OIDC client', err);
        process.exit(1);
    }
}
initializeClient();

// === Microsoft Login ===
authRouter.get('/microsoft/login', (req:Request, res:Response) => {
    const state = generators.state();
    const nonce = generators.nonce();

    res.cookie(AUTH_STATE_COOKIE, state, { httpOnly: true, sameSite: 'lax' });
    res.cookie(AUTH_NONCE_COOKIE, nonce, { httpOnly: true, sameSite: 'lax' });

    const url = client.authorizationUrl({
        scope: 'openid profile email',
        response_mode: 'query',
        nonce,
        state,
    });

    res.redirect(url);
});

authRouter.post('/login', async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required.' });
        }
        const staff = await authService.simpleAuthenticate({username, password})
        if (!staff) {
            res.status(401).json({ message: 'Invalid username or password.' });
            return;
        }
        const userPayload = {
            id: staff.id,
            email: staff.email,
            name: staff.username,
            role: staff.role,
        }
        const token = jwt.sign(userPayload, jwtSecret, { expiresIn: '1h' });
        res.cookie(AUTH_TOKEN_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: false });
    } catch (error) {
        console.error('Authentication error:', error);
        next(error);
    }
});

authRouter.get('/callback', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const state = req.cookies[AUTH_STATE_COOKIE];
    const nonce = req.cookies[AUTH_NONCE_COOKIE];

    if (!state || !nonce) {
        res.status(400).send('Missing authentication state.');
    }

    try {
        const params = client.callbackParams(req);
        const tokenSet = await client.callback(redirectUri, params, { state, nonce });

        const userinfo = await client.userinfo(tokenSet.access_token!);
        if (!userinfo || !userinfo.email) {
           res.status(500).send('Failed to retrieve user information.');
        }

        const existingUser = await authService.checkUser(userinfo.email as string);
        if (!existingUser) {
            res.redirect('http://localhost:8080/');
            return;
        }

        const userPayload = {
            id: userinfo.sub,
            email: userinfo.email,
            name: userinfo.name,
            given_name: userinfo.given_name,
            family_name: userinfo.family_name,
            role: existingUser.role,
        };

        const token = jwt.sign(userPayload, jwtSecret, { expiresIn: '1h' });

        res.clearCookie(AUTH_STATE_COOKIE);
        res.clearCookie(AUTH_NONCE_COOKIE);

        res.cookie(AUTH_TOKEN_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: false });

        res.redirect(`${dashboardRedirectUri}`);
    } catch (error) {
        console.error('Authentication error:', error);
        next(error);
    }
})


authRouter.get('/me', (req: Request, res: Response) => {
    const token = req.cookies[AUTH_TOKEN_COOKIE];
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }

    try {
        const userData = jwt.verify(token, jwtSecret);
        res.json(userData); 
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

authRouter.get('/logout', (req: Request, res: Response) => {
    res.clearCookie(AUTH_TOKEN_COOKIE);
    res.clearCookie(AUTH_STATE_COOKIE);
    res.clearCookie(AUTH_NONCE_COOKIE);
    res.redirect(`${dashboardRedirectUri}`);
});

export default authRouter;
