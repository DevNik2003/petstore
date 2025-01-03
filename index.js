import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import './db/conn.js';
import router from './routes/routes.js';
import bodyParser from 'body-parser';
import paymentRouter from './routes/paymentRouter.js';
const app = express();
dotenv.config({path:'./config.env'});
app.use(cors({
    origin:['https://petstore-5myt.onrender.com','*'],
    credentials:true
}))
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(paymentRouter);
app.use(router);
app.use(express.static('./build'))
const port =process.env.PORT||5000;
app.listen(port,()=>{
    console.log(`Our server is running at port ${port}`);
})