import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import passwordRouter from './controller/password.routes';
import initializeCronJobs from './util/provider/cronjobs';
import helmet from 'helmet';
import adminRouter from './controller/admin.routes';
import { expressjwt } from 'express-jwt';

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
        path: ['/admin/login', '/password']
    })
);


app.use('/password', passwordRouter);
app.use('/admin', adminRouter );

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

