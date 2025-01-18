import dotenv from 'dotenv';
import connectDB from '../src/db/db';
import {app} from './app';
import { connectRedis } from './db/redis';


dotenv.config({
    path: './.env' 
});

connectDB()
.then(() => {
   app.listen(process.env.PORT, () => {
    console.log(`server is listening form port ${process.env.PORT}`);
   })
//    connectRedis();
})
.catch((error) => {
    console.log(error);
})

