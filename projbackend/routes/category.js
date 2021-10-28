const express = require("express");
const router = express.Router();

const {getCategoryById,createCategory,getCategory,getAllCategory,updateCategory,removeCategory} = require("../controllers/category");
const {getUserById} = require("../controllers/user");
const {isAdmin,isAuthenticated,isSignIn} = require("../controllers/auth");

router.param("userId",getUserById); 
router.param("categoryId",getCategoryById); 


router.post("/category/create/:userId",isSignIn,isAuthenticated,isAdmin,createCategory)

router.get("/category/:categoryId",getCategory);
router.get("/categories",getAllCategory);

//update
router.put("/category/:categoryId/:userId",isSignIn,isAuthenticated,isAdmin,updateCategory);

//Delete
router.delete("/category/:categoryId/:userId",isSignIn,isAuthenticated,isAdmin,removeCategory);



module.exports = router;
