import mongoose from 'mongoose';

const connectDb = () =>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("Connected To MongoDB"))
    .catch(err => console.log("MongoDb connection error :",err))
}

export default connectDb;