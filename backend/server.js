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

app.listen(PORT,()=>{console.log(`Server started on Port ${PORT}`)});
