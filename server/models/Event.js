import mongoose from "mongoose";

const statusEnum = ["Available","busy","Swap Pending"];

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
    },
    swapId:{
        type:String
    },

});

export default mongoose.model("Event",eventSchema);