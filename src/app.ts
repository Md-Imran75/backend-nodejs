import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use( cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: '6kb'
}))

app.use(express.urlencoded({
    extended: true,
    limit: '6kb'
}))


//routes declaration
import resetdb from './app/routes/resetdb.routes'
import userRouter from './app/routes/user.routes';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/test-utils", resetdb);


app.use(cookieParser())
app.use(express.static('public'))

export {app};