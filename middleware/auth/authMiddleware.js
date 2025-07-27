const jwt = require('jsonwebtoken');
const User = require("../../model/user");

const authMiddleware = async(req,res,next)=>{

    const  authHeader = req.headers.authorization;

    if(authHeader && authHeader.startsWith("Bearer")){
        try {
            const token = authHeader.split(" ")[1];
             const decoded = jwt.verify(token, process.env.JWT_KEY);
             req.user = await User.findById(decoded.id).select("-password");
             next();         
        } catch (error) {
            res.status(401).json({message :"Not authorized,token failed"})
            
        }

       
    }else{
         res.status(401).json({ message: "Not authorized,no token" });
    }
};

module.exports = authMiddleware;



