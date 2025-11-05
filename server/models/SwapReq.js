import mongoose from "mongoose";

const statusEnum = ["accepted", "rejected", "Pending"];

const swapReqSchema = new mongoose.Schema({
    from:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true
    },
    offeredID:{
        type:String,
        required:true
    },
    receivedID:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:statusEnum
    }
})
export default mongoose.model("Requests",swapReqSchema);