
import {app} from './index';
import connectDB from './utils/db';
require("dotenv").config();



app.listen(process.env.PORT,()=>{
    console.log(`server is working with port ${process.env.PORT}`);
    connectDB();
});