import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Event from "../models/Event.js";
import Requests from "../models/SwapReq.js";

const router = express.Router();

router.get("/swappable-slots",authMiddleware,async(req,res)=>{
    const {id,email} = req.user;
    try{
        const events = await Event.find({isSwappable:true,userId:{$ne:id}});
        res.json(events);
    }
    catch (err) {
        console.error("error getting slots", err);
        res.status(500).json({
        message: "Server error while getting slots",
        });
    }
});

// POST /api/swap-request
// This endpoint should accept the ID of the user's slot (mySlotId) and the ID of the desired slot (theirSlotId).
// Server-side logic: You must verify that both slots exist and are currently SWAPPABLE. -- Done
// Create a new SwapRequest record (e.g., with a PENDING status), linking the two slots and users. --Done
// Update the status of both original slots to SWAP_PENDING to prevent them from being offered in other swaps.

router.post("/swap-request",authMiddleware,async(req,res)=>{
    const {user_Slot_Id,desired_Slot_Id} = req.body;
    // verifying 
    try{
        const one = await Event.findOne({_id:user_Slot_Id,isSwappable:true});
        const two = await Event.findOne({_id:desired_Slot_Id,isSwappable:true});

        if(!one || !two){
            return res.status(400).json({message:"Invalid Events, Cannot be swapped"});
        }

        const newReq = new Requests({
            from:one.userId,
            to:two.userId,
            offeredID:one._id,
            receivedID:two._id,
            status:"Pending"
        });
        await newReq.save();

        // Update the status 
        const updateOne = await Event.findByIdAndUpdate(
            user_Slot_Id,
            {$set:{status:"Pending"}},
            { new: true, runValidators: true } 
        );

        const updateTwo = await Event.findByIdAndUpdate(
            desired_Slot_Id,
            {$set:{status:"Pending"}},
            { new: true, runValidators: true } 
        );

        if(!updateOne || !updateTwo){
            return res.status(404).json({message:"Event not found"});
        }

        res.status(201).json({
            message: "Swap request created successfully.",
            request: newReq,
            updatedEvents: { updateOne, updateTwo },
        });
        
    }
    catch(err){
        console.log(err);
        res.status(500).json("Server Error At swap request");
    } 
});

router.get("/swap-response",authMiddleware,async(req,res)=>{
    const {id,email} = req.user;
    try{
        const notfications = await Requests.find({to:id});
        res.status(201).json(notfications);
    }
    catch(err){
        res.json(500).json({message:"Int Svr Err"});
    }
})

router.post("/swap-response/:requestId", authMiddleware, async (req, res) => {
  const { requestId } = req.params;
  const { accept } = req.body;
  const userId = req.user.id; 

  try {
    
    const swapRequest = await Request.findById(requestId);
    if (!swapRequest) {
      return res.status(404).json({ success: false, message: "Swap request not found" });
    }


    if (swapRequest.receiverId !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to respond to this swap" });
    }

    
    const offeredEvent = await Event.findById(swapRequest.offeredEventId);
    const requestedEvent = await Event.findById(swapRequest.requestedEventId);

    if (!offeredEvent || !requestedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    
    if (!accept) {
      swapRequest.status = "rejected";
      offeredEvent.isSwappable = true;
      requestedEvent.isSwappable = true;

      await Promise.all([
        swapRequest.save(),
        offeredEvent.save(),
        requestedEvent.save(),
      ]);

      return res.status(200).json({ success: true, message: "Swap request rejected" });
    }

    
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const tempUserId = offeredEvent.userId;
      offeredEvent.userId = requestedEvent.userId;
      requestedEvent.userId = tempUserId;

      offeredEvent.isSwappable = false;
      requestedEvent.isSwappable = false;

      offeredEvent.status = "busy";
      requestedEvent.status = "busy";

      swapRequest.status = "accepted";

      await Promise.all([
        offeredEvent.save({ session }),
        requestedEvent.save({ session }),
        swapRequest.save({ session }),
      ]);

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        message: "Swap successfully completed",
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    console.error("Error responding to swap:", err);
    res.status(500).json({
      success: false,
      message: "Server error responding to swap",
    });
  }
});

router.post("/add",authMiddleware,async(req,res)=>{
    const {title,isSwappable,d_Date} = req.body;
    try{
        const newEvent = new Event({
            userId:res.user.id,
            d_Date,
            isSwappable,
            title,
            status:"Available"

        });
        await newEvent.save();
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }

})

export default router;