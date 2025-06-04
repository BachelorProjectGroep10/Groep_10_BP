import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import passwordRouter from './controller/password.routes';
import userRouter from './controller/user.routes';
import groupRouter from './controller/group.routes';
import initializeCronJobs from './util/provider/cronjobs';
import helmet from 'helmet';
import vlanRouter from './controller/vlan.routes';  
import { expressjwt } from 'express-jwt';
import eventRouter from './controller/event.routes';
import authRouter from './controller/auth.routes';
import cookieParser from 'cookie-parser';

const app = express();
app.use(helmet());
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cookieParser());


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
    credentials: true,
}));

app.use(bodyParser.json());

app.use(expressjwt({
    secret: process.env.JWT_SECRET || '',
    algorithms: ['HS256'],
    getToken: req => req.cookies.auth_token,
    }).unless({ 
        path: ['/password', '/auth/login','/auth/microsoft/login', '/auth/callback']
    })
);

app.use('/password', passwordRouter);
app.use('/user', userRouter);
app.use('/group', groupRouter);
app.use('/event', eventRouter)
app.use('/vlan', vlanRouter);
app.use('/auth', authRouter);

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

