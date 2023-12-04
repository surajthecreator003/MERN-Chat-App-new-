const asyncHandler=require("express-async-handler");
const User=require("../models/userModel");
const generateToken=require("../config/generateToken")

//for signup
const registerUser=asyncHandler(async(req,res)=>{
   const {name,email,password,pic}=req.body;

   if(!name || !email || !password){
    res.status(400);
    throw new Error("Please enter All the Fields")
}

    const userExists= await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error("user already exists")
    }
    
    const user=await User.create({
        name,
        email,
        password,
        pic,
    });

    if(user){
        res.status(201).json({
        _id:user.id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token:generateToken(user._id)
    })
    }else{
        res.statusCode(400);
        throw new Error("User not Found");
    }   
})


//for login
const authUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email})

    if(user && (await user.matchPassword(password))){
      res.json({
        _id:user.id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token:generateToken(user._id)
      })
    }else{
       res.status(400);
       throw new Error("Invalid Email or Password")
    }
})


//api/users?search=user
const allUsers= asyncHandler(async(req,res)=>{
 const keyword=req.query.search ? {
    $or: [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ],
  }
: {};

 console.log(keyword);
 const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });//this ne makes sure to return all those user expect yourself for chats
 //because of this use of user._id implemented a whole auth middleware

 res.send(users);// this is gonna be used to render the users on frontend
})

module.exports={registerUser,authUser,allUsers};
 