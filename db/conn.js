import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({path:'./config.env'});

const db = process.env.DB;

mongoose.connect(db,{
    useNewUrlParser :true
})
.then(()=>{console.log('MongoDb connected....');})
.catch((err)=>{console.log(err);})