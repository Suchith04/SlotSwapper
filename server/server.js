import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors({ origin: "*"}));


connectDb();

app.use("/api",authRoutes);
app.use("/api",userRoutes);

app.listen(5000,()=>{
    console.log("Server is listening on port 5000")
});




