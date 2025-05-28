import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import passwordRouter from './controller/password.routes';
import userRouter from './controller/user.routes';
import groupRouter from './controller/group.routes';
import initializeCronJobs from './util/provider/cronjobs';
import helmet from 'helmet';
import adminRouter from './controller/admin.routes';
import vlanRouter from './controller/vlan.routes';  
import { expressjwt } from 'express-jwt';
import eventRouter from './controller/event.routes';
import authRouter from './controller/auth.routes';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Issuer, generators } from 'openid-client';


const app = express();
app.use(helmet());
dotenv.config();
const port = process.env.APP_PORT || 3000;

const allowedOrigins = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map(origin => origin.trim());

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

app.use(bodyParser.json());

app.use(expressjwt({
    secret: process.env.JWT_SECRET || '',
    algorithms: ['HS256'],
    }).unless({ 
        path: ['/admin/login', '/password', '/login', '/']
    })
);


let client: any;
let nonce: string;

const tenantId = process.env.AZURE_TENANT_ID!;
const clientId = process.env.AZURE_CLIENT_ID!;
const clientSecret = process.env.AZURE_CLIENT_SECRET!;
const redirectUri = 'https://localhost:3000/';

(async () => {
  const microsoftIssuer = await Issuer.discover(`https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`);

  client = new microsoftIssuer.Client({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [redirectUri],
    response_types: ['code'],
  });
})();

app.use('/password', passwordRouter);
app.use('/user', userRouter);
app.use('/group', groupRouter);
app.use('/event', eventRouter)
app.use('/admin', adminRouter );
app.use('/vlan', vlanRouter);



app.get('/login', (req, res) => {
  nonce = generators.nonce();
  const authUrl = client.authorizationUrl({
    scope: 'openid email profile',
    nonce,
  });
  res.redirect(authUrl);
});

// This is your registered redirect URL: https://localhost:3000/
app.get('/', async (req, res) => {
  const params = client.callbackParams(req);

  try {
    const tokenSet = await client.callback(redirectUri, params, { nonce });
    const userinfo = await client.userinfo(tokenSet.access_token!);

    const token = jwt.sign(userinfo, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // Redirect back to frontend with token
    res.redirect(`https://localhost:8080/?token=${token}`);
  } catch (err) {
    console.error('Callback error:', err);
    res.status(500).send('Authentication error');
  }
});

initializeCronJobs();

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(err.name === 'UnauthorizedError') {
        res.status(401).json({status: 'error', message: err.message});
    } else {
    res.status(400).json({status: 'application error', message: err.message});
    }
});

app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
});

