const express=require("express");

const {allMessages,sendMessage} =require("../controllers/messageControllers");
const { protect } = require("../middlewares/authMiddleware");

const router=express.Router();


//this route will be responsible for getting all the messages of a particular chat
router.route("/:chatId").get(protect,allMessages);

//this one will be responsible for sending the messages
router.route("/").post(protect,sendMessage);

module.exports = router;