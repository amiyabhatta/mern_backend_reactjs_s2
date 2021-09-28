const User = require("../models/user");
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


exports.signup = (req,res) => {

    //req is filled with validation error comming from check which is used in auth.js route
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(
          { 
              errors: errors.array()[0].msg
          }
        );
    }  

  const user = new User(req.body);
  user.save((err, user) => {
    if(err){
       return res.status(400).json({
           err : "Bad Request"
       }) 
    }
   return res.status(200).json({
       message:"Signup Sucessfull !",
       date:user
   })
  })
};


exports.signin = (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(
        { 
            errors: errors.array()[0].msg
        }
      );
  }
 const {email, password} = req.body;

 //check user exists or not in DB
 User.findOne({email},(err, user) => {
    if(err || !user){
      return res.status(401).json(
        { 
            errors: 'User does not exists'
        }
      ); 
    }

    //If passwrod doest not match
    if(!user.authenticate({password})){
      return res.status(401).json(
        { 
            errors: 'Email and Password doest not match'
        }
      ); 
    }

    
    //create token
    const token =  jwt.sign({ _id:user._id,status:'sucess' }, process.env.SECRET);
    //put token in the cookie
    res.cookie("token",token, {expire:new Date()+process.env.COOKIE_EXPIRE});
    //Send responce to front end
    const {_id,name,email,role} = user;
    return res.status(200).json({token,user:{_id,name,email,role}});

 })
};

exports.signout = (req,res) => {
  res.clearCokkie("token");
  return res.status(200).json({
    message:"User signout sucessfully"
  });
}

//proteted routes
exports.isSignIn = expressJwt({
  secret: process.env.SECRET,
  requestProperty:"auth"
})

//Custome middleware
exports.isAuthenticated = (req,res,next) => {
  //req.auth._id comming from requestProperty:"auth"
  let checker = req.profile && req.auth && req.profile._id == req.auth._id; 
  if(!checker){
    return res.status(403).json({
      error:"Access Denied"
    });
  }
  next();
}


exports.isAdmin = (req,res,next) => {
  //0 = Normal user
  //1 = Admin 
  //Both is refrence of user model user_role
  if(req.profile.role === 0){
    return res.status(403).json({
      error:"Not Admin!Access Denied"
    });
  }
  next();
}