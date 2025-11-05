import express from 'express';
import mongoose from 'mongoose';
import authMiddleware from '../middleware/authMiddleware.js';
import Event from "../models/Event.js";
import Requests from "../models/SwapReq.js";

const router = express.Router();

router.get("/swappable-slots",authMiddleware,async(req,res)=>{ // slots that are swappable(other than users slots)
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

router.get("/my-slots",authMiddleware,async(req,res)=>{ // users slots to show on Dashboard
    const {id,email} = req.user;
    try{
        const events = await Event.find({userId:id});
        res.json(events);
    }
    catch (err) {
        console.error("error getting slots", err);
        res.status(500).json({
        message: "Server error while getting slots",
        });
    }
});

router.get("/my-swappable", authMiddleware, async (req, res) => { //users own swappable reqs
  try {
    const events = await Event.find({ userId: req.user.id, isSwappable: true });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching your swappable slots" });
  }
});

router.post("/swap-request",authMiddleware,async(req,res)=>{ //send a new swap request
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

router.get("/swaps-sent",authMiddleware,async(req,res)=>{ //how many have swap reqs have you sent
  const id = req.user.id;
  try{
    const sent = await Requests.find({from:id});
    res.status(201).json(sent);
  }
  catch(err){
    res.json(500).json({message:"Internal Server Error"});
  }
})

router.patch("/events/:id/update", authMiddleware, async (req, res) => { // swappable 
  const { id } = req.params;
  const { isSwappable, status } = req.body;
  const userId = req.user.id;

  try {
    const updated = await Event.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isSwappable, status } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json({ event: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating event" });
  }
});


router.get("/swaps-received",authMiddleware,async(req,res)=>{ //notificatons received for swaps
    const {id,email} = req.user;
    try{
        const notfications = await Requests.find({to:id});
        res.status(201).json(notfications);
    }
    catch(err){
        res.status(500).json({message:"Int Svr Err"});
    }
})

router.post("/swap-response/:requestId", authMiddleware, async (req, res) => { //accept or reject a request
  const { requestId } = req.params;
  const { accept } = req.body;
  const userId = req.user.id; 

  try {
    
    const swapRequest = await Requests.findById(requestId);
    if (!swapRequest) {
      return res.status(404).json({ success: false, message: "Swap request not found" });
    }


    if (swapRequest.to !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to respond to this swap" });
    }

    
    const offeredEvent = await Event.findById(swapRequest.offeredID);
    const requestedEvent = await Event.findById(swapRequest.receivedID);

    if (!offeredEvent || !requestedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    
    if (!accept) {
      swapRequest.status = "rejected";
      offeredEvent.isSwappable = true;
      requestedEvent.isSwappable = true;

      offeredEvent.status = "available";
      requestedEvent.status = "available"

      await Promise.all([
        swapRequest.save(),
        offeredEvent.save(),
        requestedEvent.save(),
      ]);

      return res.status(200).json({ success: true, message: "Swap request rejected" });
    }

    const tempUserId = offeredEvent.userId;
  offeredEvent.userId = requestedEvent.userId;
  requestedEvent.userId = tempUserId;

  // Update flags and statuses
  offeredEvent.isSwappable = false;
  requestedEvent.isSwappable = false;

  offeredEvent.status = "available";
  requestedEvent.status = "available";

  swapRequest.status = "accepted";

  // Save all changes in parallel (no session/transaction needed)
  await Promise.all([
    offeredEvent.save(),
    requestedEvent.save(),
    swapRequest.save(),
  ]);

  res.status(200).json({
    success: true,
    message: "Swap successfully completed",
  });
  } catch (err) {
    console.error("Error responding to swap:", err);
    res.status(500).json({
      success: false,
      message: "Server error responding to swap",
    });
  }
});

router.post("/add",authMiddleware,async(req,res)=>{ //adding Events (Time Slots) on Calendar
    const {title,isSwappable,d_Date} = req.body;
    try{
        const newEvent = new Event({
            userId:req.user.id,
            d_Date,
            isSwappable,
            title,
            status:"Available"

        });
        await newEvent.save();
        res.status(201).json({
            message: "Event created successfully",
            event: newEvent
        });
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
})

export default router;