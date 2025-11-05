import mongoose from "mongoose";

const statusEnum = ["Available","available","accepted","Pending"];

const eventSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    d_Date:{
        type:Date,
        required:true
    },
    isSwappable:{
        type:Boolean,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:statusEnum
    }
});

export default mongoose.model("Event",eventSchema);