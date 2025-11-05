import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register',async(req,res)=>{
    const {name,email,password} = req.body;

    try{
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new User({name,email,password:hashedPass});
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal Server Error"});
    }
});

router.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    try{
        const userProfile = await User.findOne({email});
        if(!userProfile){
            return res.status(400).json({message:"Invalid Email"});
        }

        const matched = await bcrypt.compare(password,userProfile.password);
        if(!matched){
            return res.status(400).json({message:"Invalid Password"});   
        }

        const token = jwt.sign(
            { id: userProfile._id, email: userProfile.email },
            process.env.JWT_CODE || 'secretKey',
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    }
    catch(err){
        console.log(err)
        return res.status(501).json({message:"Internal Server Error"});
    }
})

export default router;