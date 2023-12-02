const {registerUser,authUser} = require("../controllers/userControllers")
const express=require("express");

const router=express.Router()


router.route("/").post(registerUser)
router.post("/login",authUser)

module.exports=router;
