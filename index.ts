import express, { json } from 'express';
import 'express-async-errors';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { db } from './utils/db';
import { authRouter } from './routers/auth.router';
import { adminRouter } from './routers/admin.router';
import { userRouter } from './routers/user.router';
import { hrRouter } from './routers/hr.router';
import { job } from './utils/scheduleOfChangeStatus';
import { handleError } from './utils/handleError';

dotenv.config();

const app = express();
app.use(json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(helmet());

app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10000,
  })
);

job.start();

app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/hr', hrRouter);

app.use(handleError);

(async () => {
  try {
    await db();
    app.listen(process.env.PORT || 3001, () => console.log('Listening on port 3001'));
  } catch (err) {
    console.error(`Connection failed. ${err}`);
  }
})();
