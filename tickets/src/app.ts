import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import 'express-async-errors';
import {json} from 'body-parser'
import { errorHandler, NotFoundError, currentUser } from '@spetsartickets/common';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy',true);
app.use(json());
app.use(
    cookieSession({
        signed: false, // true if you want to sign cookies
        secure: process.env.NODE_ENV !== 'test', // use secure cookies in production
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })
);

app.use(currentUser)
app.use(showTicketRouter)
app.use(createTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.all('*', async  () => {
    throw new NotFoundError()
});
app.use(errorHandler as ErrorRequestHandler);

export {app}