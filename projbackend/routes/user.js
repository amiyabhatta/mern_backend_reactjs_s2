const express = require("express");
const router = express.Router();



const {getUserById,getUser,getAllUser, updateUser, userPurchaseList} = require("../controllers/user");
const {isAdmin,isAuthenticated,isSignIn} = require("../controllers/auth");

router.param("userId",getUserById); //This gives user info when passed with user id

//Note : if any route here user/ 
//then it first goes to router.param("userId",getUserById)

router.get("/user/:userId",isSignIn,isAuthenticated,getUser);
router.get("/users",getAllUser);
router.put("/user/:userId",isSignIn,isAuthenticated,updateUser);
router.get("/orders/user/:userId",isSignIn,isAuthenticated,userPurchaseList);



module.exports = router;