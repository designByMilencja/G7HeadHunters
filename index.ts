import express, {json} from 'express';
import 'express-async-errors';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from "helmet";
import {handleError} from "./utils/handleError";
import {homeRouter} from "./routers/home.router";


const app = express();
app.use(helmet());
app.use(json());
app.use(cors({
    origin: 'http://localhost:3000',
}));


const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10000,
});
app.use(limiter);
app.use('/', homeRouter);

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
})
