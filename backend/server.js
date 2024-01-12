const express=require("express");

const dotenv=require("dotenv");

const connectDB=require("./config/db.js")

const userRoutes=require("./routes/userRoutes");
const chatRoutes=require("./routes/chatRoutes");
const messageRoutes=require("./routes/messageRoutes");

const {notFound,errorHandler} =require("./middlewares/errorMiddleware")

const {chats} = require("./data/data")
//console.log(chats);

dotenv.config();
connectDB();


const app=express();

app.use(express.json());//to accept json data and convert it to normal data



app.get("/",(req,res)=>{
    res.send("API is Running")
})

//for signup and login and also to get all users lists wihout the one that is sending the request
app.use("/api/user",userRoutes);


 //One on One and Group Chats add,update,get,delete users
app.use("/api/chat",chatRoutes);
//not for sending message rather to add only users 


app.use("/api/message",messageRoutes);


app.use(notFound);
app.use(errorHandler);


const PORT=process.env.PORT || 5000

const server=app.listen(PORT,()=>{console.log(`Server started on Port ${PORT}`)});



//this is ame as creating raw httpSrver or a express erver and passing it to a a webSockets server
const io=require("socket.io")(
    server,
    {
        cors:{
        origin:"http://localhost:3000"
         },
         pingTimeout:6000000,// is in milliseconds and tells that to wait for 60 seconds for the user to send something or else close the bandwidth
    }
)
//we didnt used any express middleware for socket.io like we used to do while 
//connecting or passing over the express server to websockets server as the socket.io
//gets seemlessly integrated with express server



console.log(io);



io.on("connection",

        (socket)=>{
            console.log("Hurray connected to socket.io from frontend");


            //create room with the user Id of the logged in user
            socket.on("setup",(userData)=>{//setup is a custom event and is not part of socket.io
                socket.join(userData._id);//will create a room with the same id as the logged in  user id
                console.log("Room Created with the user_id=",userData._id)

                socket.emit("connected");
            })


            //THIS IS MOST IMPORTANT AS THIS ROOM CONNECTS ALL OTHER INDIVIDUAL ROOMS AND ALSO
            //HELPS IN UPDATING THE SSENDERS OR RECEIERS CHAT LIST
            //creates room with the selected chatId whether it be One on One or GroupChat
            socket.on("join chat",(room) =>{
                socket.join(room);
                console.log("Room Crearted with the Chat_id  =",room)
            })//this is good as when we create the Room with the chat id all user present in the
            //user row can join whether it be one on One or Group Chaat


            socket.on("new message",(newMessageReceived)=>{
                console.log("new message received = ",newMessageReceived)
                var chat=newMessageReceived.chat;
                

                
                if(!chat.users) { console.log("chat.users not defined");return }
                //if user is not even connected to socket or hasnt connectd to roomm then also
                //it will not create any error as socket.io is handling it

                

                chat.users.forEach(user =>{
                    if(user._id == newMessageReceived.sender._id) return

                    //else
                    //if its not the same user then emmit the message to that user room
                    socket.in(user._id).emit("message received",newMessageReceived)
                    //remember in is not a part of socket.io and is used to normally check for the room id
                    //even yhough the user is not connected to the socket.it will still work.
                })
                
            })

            //this will help in idnicating typing indicator
            socket.on("typing",(room)=>{
                socket.in(room).emit("typing")
            })      


            socket.on("stop typing",(room)=>{
                socket.in(room).emit("stop typing")
            })



            //clsoe the socket server after whatever pingTimeout is given 
            //after inactivity
            socket.off("setup", () => {
                console.log("USER DISCONNECTED");
                socket.leave(userData._id);
              });



        }

       

        
    )
