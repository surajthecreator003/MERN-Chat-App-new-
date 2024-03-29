const asyncHandler = require("express-async-handler");

const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })//chatId is the user that is sending the request
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;//chatId is the user that is sending
  //and content is the message that is being sent from that suer   

  if (!content || !chatId) {//if no content is sent or the userId is not there then
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  
  //creating the new message document to be stored inisde Message Model
  var newMessage = {
    sender: req.user._id,//this is the id of the user that you are using
    content: content,
    chat: chatId,//chatId is recived after clicking the user after search
  };

  try {//the MAIN MECHANISM AND SOUL BEHIND THE CHATS THAT WE DID 
    //REPLACING ALL THE IDS WITH THE REAL VALUES AND SENDING THEM BACK TO FRONTEND TO RENDER


    var message = await Message.create(newMessage);//creates a new document in the Message Colllection
    console.log("Message object after creating a Document in the Message Collection = ",message)
     //will only return whatever nessage is sent


    //dont use .execPopulate() as it will not work in newer versionns of promise as the .populate will return promise anyway
    message = await message.populate("sender", "name pic");
    console.log("Returned Message Object getting populated  = ",message)
   //will change the sender row value in the document with a object containing 
   //name and pic
    

    //chatId and the Chat Object is already created before when we clicked on the user after searched
    //so this chat row will default to that id and will push that chatid  Object from the Chat Collection and then 
    // update the message object
    message = await message.populate("chat");
    console.log("After populating the chat row of the returned object=",message)
    //and now the chat row value which would be having an id before will get replaced by real value
    //from the Chat Collection

    


    //now this will update the users row of the chat with the fetched ones
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    console.log("Now after replacing the users ID with the real users in the chat object=",message);


    //will update the latest message in the Chat document in the Chat Colllection
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });


    res.json(message);//on frontend this will be used as setMessages([...messages,data])

  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };