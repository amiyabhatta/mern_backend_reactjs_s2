const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
   User.findById(id).exec((err,user) => {
        if(err || !user){
            return res.status(400).json({
                error:"No User found in Db"
            });
        }
        req.profile = user;
        next();
   });
}

exports.getUser = (req, res, next) => {
    req.profile.salt='';
    req.profile.encry_password='';
    return res.json(req.profile);
}

exports.getAllUser = (req,res) => {
    User.find().exec((err,user) => {
        if(err | !user){
            return res.status(400).json({
                erro:"No user found in DB"
            })
        }
        
        var userMap = {}; 

user.forEach(function(user) { 

    user.salt = undefined;
    user.encry_password = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;
userMap[user._id] = user;



}); 

//res.send(userMap); 

        res.status(200).json({
            data:userMap
         })
    })
}

//update user
exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
        {_id:req.profile._id}, //Find user
        {$set:req.body},//What you want to update
        {new:true,useFindAndModify:false}, //Compulsury parameter
        (err,user) => {
           if(err && !user){
            return res.status(400).json({
                erro:"You are not authorized to update this user"
            }) 
           } 

           user.salt = undefined;
           user.encry_password = undefined;
           return res.json(user);
        }

        
    )
}

exports.userPurchaseList = (req,res) => {
    //req.profile._id : comming from middle ware 
    Order.find({user:req.profile._id})
         .populate("user","_id name")
        .exec((err,order) => {
            if(err){
                return res.status(400).json({
                    erro:"No Order in this account"
                }) 
            }

            return res.json(order);
        });
}

exports.pushOrderInPurchaseList = (req,res,next) => {
    let purchase = [];
    req.body.order.products.forEach(product => {
        purchase.push({
            _id:product.id,
            name:product.name,
            description:product.description,
            category:product.category,
            quantity:product.quanity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        })
    })
   //Store this in db
   //{new : true} //After update send the new object from DB not the old
   User.findOneAndupdate(
       {_id:req.profile._id},
       {$push : {purchase:purchase}},
       {new : true},
       (err, purchase) => {
            if(err){
                return res.status(400).json({
                    error:"Unable to save purchase list"
                })
            }
            next();
       }
   )
}