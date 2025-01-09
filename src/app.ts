import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))


app.use(cookieParser())
app.use(express.static('public'))



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
import adminAuthRouter from './app/routes/adminAuth.routes'
import userManagement from './app/routes/userManagement.routes'

app.use("/api/v1/admins-auth", adminAuthRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/test-utils", resetdb);
app.use("/api/v1/admin/dashboard/user-management", userManagement);



export { app };