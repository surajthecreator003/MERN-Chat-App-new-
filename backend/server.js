const express=require("express");
const dotenv=require("dotenv");
const connectDB=require("./config/db.js")
const userRoutes=require("./routes/userRoutes");
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

// app.get("/api/chat",(req,res)=>{
//     res.send(chats)
// })


// app.get("/api/chat/:id",(req,res)=>{
//     const singleChat=chats.find((c) => c._id === req.params.id); 
//     res.send(singleChat);
//     console.log(req.params.id)})


app.use("/api/user",userRoutes)

app.use(notFound);
app.use(errorHandler);


const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{console.log(`Server started on Port ${PORT}`)});
