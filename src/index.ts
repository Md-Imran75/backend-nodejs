import dotenv from 'dotenv';
import connectDB from '../src/db/db';
import {app} from './app';


dotenv.config();

connectDB()
.then(() => {
   app.listen(process.env.PORT, () => {
    console.log(`server is listening form port ${process.env.PORT}`);
   })
})
.catch((error) => {
    console.log(error);
})

