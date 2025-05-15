import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import passwordRouter from './controller/password.routes';
import initializeCronJobs from './util/provider/cronjobs';
const app = express();

dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors({origin: process.env.APP_PORT || 'http://localhost:8080'}));
app.use(bodyParser.json());

app.use('/password', passwordRouter);

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

