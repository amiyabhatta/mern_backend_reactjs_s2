const express = require("express"); 
const router = express.Router();

const { getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts, getAllUniqueCategories} = require("../controllers/product");
const { getUserById } = require("../controllers/user");
const {isSignIn,isAuthenticated,isAdmin} = require("../controllers/auth");

//all if params
router.param("userId",getUserById);  
router.param("productId",getProductById);

//all of actual routes
router.post("/product/create/:userId", isSignIn, isAuthenticated, isAdmin, createProduct);

//read routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//delete route
router.delete("/product/:productId/:userId", isSignIn, isAuthenticated, isAdmin, deleteProduct);

//update route
router.put("/product/:productId/:userId", isSignIn, isAuthenticated, isAdmin, updateProduct);

//listing route
router.get("/products", getAllProducts);

router.get("/products/categories", getAllUniqueCategories);


module.exports = router;