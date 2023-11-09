const express=require("express");
const dotenv=require("dotenv");

const {chats} =require("./data/data.js")
//console.log(chats);

dotenv.config();


const app=express();

app.get("/",(req,res)=>{
    res.send("API is Running")
})

app.get("/api/chat",(req,res)=>{
    res.send(chats)
})


app.get("/api/chat/:id",(req,res)=>{
    const singleChat=chats.find((c) => c._id === req.params.id); 
    res.send(singleChat);
    console.log(req.params.id)})


const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{console.log(`Server started on Port ${PORT}`)});
