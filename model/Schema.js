import mongoose from 'mongoose';
const registerSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    wallet:{
        type:Number,
        required:true
    },
    token:{
        type:String,
    },
});

export const RegisterModel = new mongoose.model("registermodel",registerSchema);
const productSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    breed:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    available:{
        type:Boolean,
        required:true
    }
});

export const ProductModel = new mongoose.model("productmodel",productSchema);
const cartSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    productId:{
        type:String,
        required:true
    }
})

export const CartModel = new mongoose.model("cartmodel",cartSchema);
const orderSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    productId:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
    
})

export const OrderModel = new mongoose.model("ordermodel",orderSchema);
