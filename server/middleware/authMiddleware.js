import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next) =>{
    const token = req.header("Authorization")?.split(" ")[1];
    // token starts with 'Bearer' so split and skip that part.

    if(!token) return res.status(401).json({message :"No Token Detected"});

    try{
        const verify = jwt.verify(token,process.env.JWT_CODE);

        req.user = verify;
        next();
    }
    catch(err){
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }

}

export default authMiddleware;
