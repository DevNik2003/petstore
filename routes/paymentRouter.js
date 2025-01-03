import express from 'express';
import Razorpay from 'razorpay';
import { checkout, paymentVerification } from '../controllers/paymentControl.js';
import dotenv from 'dotenv';
import { Authenticate } from '../middleware/authenticate.js';

const paymentRouter = express.Router();
dotenv.config({path:'./config.env'});
export const instance = new Razorpay({
    key_id: process.env.keyId,
    key_secret: process.env.keySecret,
  });
  paymentRouter.route('/checkout').post(checkout)
  paymentRouter.post('/paymentverification',paymentVerification)
  paymentRouter.get('/getrzrkey',(req,res)=>{
    res.status(200).json(process.env.keyId)
  })
  
export default paymentRouter