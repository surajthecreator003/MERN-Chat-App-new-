const express=require("express");

const {protect}=require("../middlewares/authMiddleware")

const {accessChat,fetchChats,createGroupChat}=require("../controllers/chatControllers")

const router=express.Router()

router.route("/").post(protect,accessChat);//THIS WILL CREATE THE CHAT WITH THE USER INITIALLY
// AFTER CLICKING ON THAT SINGLE  USER OR WILL HELP POPULATE THAT SINGLE USER CHATS

router.route("/").get(protect,fetchChats);//THIS WILL HELP IN FETCHING ALL THE CHATS AFTER WE LOGIN
// IF THERE ARE ANY PREVIOUS MADE MESSAGES

router.route("/group").post(protect,createGroupChat);
// router.route("/rename").put(protect,renameGroupChat);
// router.route("/groupremove").put(protect,removeFromGroup);
// router.route("/groupadd").put(protect,addToGroup);


module.exports=router;