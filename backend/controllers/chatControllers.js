const asyncHandler = require("express-async-handler");
const Chat=require("../models/chatModel");
const User=require("../models/userModel")


//POST request
//this route will be responsible for fetching and Creating one on one chat only and not group chat
const accessChat=asyncHandler(async(req,res)=>{
  
    const {userId}=req.body;// theoretically you will get this "userId" after clicking on 
     // the fetched Users from search user feature after that whatever user you click should
     // get stored in the current User along with the clicked user 
     // thats how you send the userId(manually)

    if(!userId){
           console.log("userId param not sent with request")
           return res.sendStatus(400);
    }

    //this isChat should only happen when the user has some previous chats with that receiver
    var isChat=await Chat.find({
        isGroupChat:false,
        $and:[
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate("users","-password").populate("latestMessage");
    //if .populate() fails then there will be empty array  

      // this isChat will be empty if the .populate() failed 
      //so making the isChat.length = 0
      isChat=await User.populate(isChat,{
        path:"latestMessage.sender",select:"name pic email",
      })

      if(isChat.length > 0){
        res.send(isChat[0]);
      } else {
            //chatdata should be 
            var chatData={
                chatName:"sender",
                isGroupChat:false,
                users:[req.user._id,userId],
            }

      };

      //if tehre were no previous conversations then it will move to the try Block for initial "CLICK ON USER FOR CHAT"
      //remember var is function scoped so dont get confused with chatData insideChat.create(chatData)
      try{

        //this creates the Chat first time when we click on the user after
        //searching for that user in that search bar
          const createdChat=await Chat.create(chatData);
          const FullChat=await Chat.findOne({_id:createdChat._id})

          res.status(200).send(FullChat)
      }
      catch(error){
            res.status(400);
            throw new error(error.message);
      }
})



//fetchChats  WILL RUN WHEN WE LOGIN WITH USER to fetch all current users
//fetches all the chat for that particular chats
const fetchChats=asyncHandler(async(req,res)=>{

  //user._id will be sent to backend when we click on that user
  //.sort() will helpus sort from latest to old
  try{
    Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
    .populate("users","-password")
    .populate("groupAdmin","-password")    
    .populate("latestMessage")
    .sort({updatedAt:-1})
    .then(async (results) => {
      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
        res.status(200).send(results);
    })
  }catch(error){

  }
})


//will be a POST request 
const createGroupChat = asyncHandler(async(req,res)=>{

 if(!req.body.users  || !req.body.name){
  return res.status(400).send({message: "Please Fill all the Fields"})
 }

 var users=JSON.parse(req.body.users)

 if(users.length < 2){//initially will check if the number of users for a group is 2
  return res.status(400).send("More than 2 are required to form a Group")
 }

 users.push(req.user);//as we also want ourself or the user that is creating the group

 try{
   const groupChat=await Chat.create({

    chatName:req.body.name,
    users:users,
    isGroupChat:true,
    groupAdmin:req.user,

   });

   const fullGroupChat=await Chat.findOne({_id:groupChat._id})
   .populate("users","-password")
   .populate("groupAdmin","-password");

   res.status(200).json(fullGroupChat);
 }catch(error){  

 }
})



//will be a PUT route
//this handler will be responsible for renaming the group Chat name
const renameGroupChat=asyncHandler(async(req,res)=>{
   const  {chatId,chatName} = req.body;

   const updatedChat=await Chat.findByIdAndUpdate(
    chatId,{
      chatName,
    },
    {
      new:true
    }
   )
   .populate("users","-password")
   .populate("groupAdmin","-password")

   if(!updatedChat){
    res.status(404);
    throw new Error("Chat not found")
   }else{
    res.json(updatedChat);
   }
})

module.exports={accessChat,fetchChats,createGroupChat, renameGroupChat}