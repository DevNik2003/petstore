import express from 'express';
import { CartModel, OrderModel, ProductModel, RegisterModel } from '../model/Schema.js';
import jwt from  'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { Authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

router.get('/home',async(req,res)=>{
    const data = await ProductModel.find();
    res.status(200).send(data);
})
router.post('/filter',async(req,res)=>{
    const data = await ProductModel.find({category:req.body.filter});
    res.status(200).send(data);
})
router.post('/tocart',async(req,res)=>{
    const data = req.body;
   const chk =  await CartModel.find({userId:data.userId},{productId:data.productId});
    if(chk.length===0){

    
    const savedata = await CartModel(data);
    await savedata.save();
    res.status(200).send("Added to cart");
}
else{
    res.status(203).send("Pet already in cart");
}
})
router.post('/order',async(req,res)=>{
    const data = req.body;
    const fullData = {...data,status:'Shipped'}
    const savedata = await OrderModel(fullData);
    await savedata.save();
    res.status(200).send("Ordered Successfully");
})
router.post('/rmitem',async(req,res)=>{
    const data = req.body;
    const savedata = await CartModel.deleteOne({userId:data.userId,productId:data.productId});
    res.status(200).send("Deleted Successfully");
})
router.get('/chklogin',Authenticate,(req,res)=>{
    const data = req.rootUser;
    res.status(200).send(data);
})
router.get('/getids',Authenticate,async(req,res)=>{
    const data = req.rootUser;
    const senddata = await CartModel.find({userId:data._id});
    res.send(senddata);
})
router.post('/getcartdata',async(req,res)=>{
    const data = req.body;
    const senddata = await ProductModel.find({_id:data.id});
    res.send(senddata);
})
router.get('/getorderids',Authenticate,async(req,res)=>{
    const data = req.rootUser;
    const senddata = await OrderModel.find({userId:data._id});
    res.send(senddata);
})
router.post('/getorderdata',async(req,res)=>{
    const data = req.body;
    const senddata = await ProductModel.find({_id:data.id});
    res.send(senddata);
})
router.post('/signup',async(req,res)=>{
    const data  = req.body;
    const allData = { ...data, wallet: 0 }; 
    const chk = await RegisterModel.findOne({email:data.email});
    if (chk==null){
        const saveUser = await RegisterModel(allData);
        await saveUser.save();
        res.status(200).send('Registered successfully')
    }
    else{
        res.status(400).send('User already exists');
    }
})
router.post('/signin',async(req,res)=>{
    const data = req.body;
    const chk = await RegisterModel.findOne({email:data.email});
    if (!chk) {
        return res.status(400).send('User does not exist');
      }
    
      if (chk.password !== data.password) {
        return res.status(400).send('Invalid password');
      }
      const token = jwt.sign({ _id: chk._id }, process.env.SECRETKEY, { expiresIn: '1d' });
      await RegisterModel.updateOne({ email: data.email }, { $set: { token: token } });
      res.cookie('authToken', token, { maxAge: 86400000, httpOnly: true }); // Expires in 1 day (24 hours), httpOnly flag for security
      res.status(200).send('Login successfully');
})
router.post('/addproduct',async(req,res)=>{
    const data = req.body;
    const incavail = {...data,available:true}
    const datas =  await ProductModel(incavail);
    await datas.save();
    res.status(200).send("Product added");
           
})
router.get('/logout',(req,res)=>{
    
    res.clearCookie('authToken', {
        domain: '.onrender.com',  // Matches all subdomains of onrender.com
        path: '/',                // Ensure this matches the path you initially set the cookie with
        secure: true,             // Secure flag for HTTPS
        httpOnly: true            // Ensure it's not accessible via client-side JavaScript
    });
    res.send('cleared')
})
router.get('/getdproduct',async(req,res)=>{
    const data = await ProductModel.findOne({_id:req.query.id});
    res.status(200).send(data);
})
router.get('/getmypets',async(req,res)=>{
    const data = await ProductModel.find({userId:req.query.userid});
    res.status(200).send(data);
})
router.get('/petsbycat',async(req,res)=>{
    const category = req.query.category;
    const data = await ProductModel.find({category:category});
    res.status(200).send(data);
})
router.put('/updatewallet',async(req,res)=>{
    const data = req.body;
    await RegisterModel.findOneAndUpdate({_id:data.userId},{$set:{wallet:data.wallet}});
    res.status(200).send("payment success");
})
router.put('/updatepets',async(req,res)=>{
    const data = req.body;
    await ProductModel.findOneAndUpdate({_id:data.productId},{$set:{available:false}});
    res.status(200).send("pet deleted");
})
router.put('/sellerupdatewallet',async(req,res)=>{
    const data = req.body;
    await RegisterModel.findOneAndUpdate({_id:data.sellerId},{$inc:{wallet:data.wallet}});
    res.status(200).send("money added in sellers wallet");
})



export default router;
