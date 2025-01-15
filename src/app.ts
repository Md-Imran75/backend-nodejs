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
import resetdb from './apps/routes/resetdb.routes'
import userRouter from './apps/routes/user.routes';
import adminAuthRouter from './apps/adminDashboard/authService/routes/adminAuth.routes'
import userManagement from './apps/adminDashboard/userManagement/routes/userManagement.routes'

app.use("/api/v1/admins-auth", adminAuthRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/test-utils", resetdb);
app.use("/api/v1/admin/dashboard/user-management", userManagement);



export { app };