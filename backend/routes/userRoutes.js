const {registerUser} = require("../controllers/userControllers")
const express=require("express");

const router=express.Router()


router.route("/").post(registerUser)
//router.route("/login").get(()=>{}).post(()=>{})

module.exports=router;
