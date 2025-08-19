const adminOnly = (req,res,next)=>{
if(req.user && req.user.role === 'admin'){
    next();
}else{
    res.status(403).json({message:"access denied :Admins only "});
}
};
module.exports = adminOnly;