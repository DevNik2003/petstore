import { RegisterModel } from "../model/Schema.js";
import { instance } from "../routes/paymentRouter.js";
import crypto from 'crypto';

export const checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100), // amount in the smallest currency unit
      currency: "INR",
    };

    const order = await instance.orders.create(options);


    // Send the order details as a response
    res.status(200).json(order);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const paymentVerification = async (req, res) => {
  try {
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body; 
    const body = razorpay_order_id +"|" + razorpay_payment_id
    var expectedSignature = crypto.createHmac('sha256',process.env.keySecret).update(body.toString()).digest('hex');
    if(expectedSignature===razorpay_signature){
      const order = await instance.orders.fetch(razorpay_order_id);

      // Extract email from order details
      const email = req.query.email;

      // Update MongoDB with the added amount
      const user = await RegisterModel.findOneAndUpdate(
        { email: email },
        { $inc: { wallet: order.amount / 100 } }, // Convert amount back to currency
        { new: true }
      );
        res.status(200).redirect('http://localhost:3000/')
    }
    else{
        res.status(400).send("payment unsuccessfull");
    }

  } catch (error) {
  
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
