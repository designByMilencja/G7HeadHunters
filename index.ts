import express, { json } from 'express';
import 'express-async-errors';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { db } from './utils/db';
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";
// import {v4 as uuid} from "uuid";
import { handleError } from './utils/handleError';
import { homeRouter } from './routers/home.router';
import { authRouter } from './routers/auth.router';

dotenv.config();
const app = express();
app.use(json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// const secretKey = process.env.SECRET_KEY;
app.use(
  cors({
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

app.use('/auth', authRouter);
app.use('/', homeRouter);

app.use(handleError);

(async () => {
  try {
    await db();
    app.listen(process.env.PORT || 3001, () => console.log('Listening on port 3001'));
  } catch (err) {
    console.error(`Connection failed. ${err}`);
  }
})();
