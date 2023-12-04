const jwt=require("jsonwebtoken");
const User=require("../models/userModel.js");
const asyncHandler=require("express-async-handler")

const protect=asyncHandler(async(req,res,next)=>{
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        try {

          //bcz token looks like this => bearer whatevertoken
          token = req.headers.authorization.split(" ")[1];
          console.log(token);//comment this out

          //decodes token id by verying the jwt token that we sent to clinet after authorization
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log(decoded);//comment this out
          req.user = await User.findById(decoded.id).select("-password");
    
          next();
        } catch (error) {
          res.status(401);
          throw new Error("Not authorized, token failed");
        }
      }
    
      if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
      }
})


module.exports = { protect };





//Note-Remember the jwt token that we sent to frontend during signup or login that
//token is being used here to verify again as it gets sent with the request that we 
//do when we sent the query for search along the url(the token gets attached automatically
//by browser on every subsequesnt request after authorization) which we will take and
//verify user and take out the id from it and passs it on the mongodb to get whatevr details
//needed and attaches it back to the request object
//so it can be used by the next function or controller passed in with the help of next