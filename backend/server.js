const express=require("express");
const dotenv=require("dotenv");
const connectDB=require("./config/db.js")
const userRoutes=require("./routes/userRoutes");
const chatRoutes=require("./routes/chatRoutes");
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

app.use("/api/user",userRoutes);


app.use("/api/chat",chatRoutes)

app.use(notFound);
app.use(errorHandler);


const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{console.log(`Server started on Port ${PORT}`)});
