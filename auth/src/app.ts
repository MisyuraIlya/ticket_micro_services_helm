import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import {json} from 'body-parser'
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@spetsartickets/common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy',true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
)
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async  () => {
    throw new NotFoundError()
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);  
});
export {app}