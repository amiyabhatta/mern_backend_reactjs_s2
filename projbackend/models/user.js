var mongoose = require("mongoose");
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

var userSchema = new mongoose.Schema(
{
    name:{
       type:String,
       required:true,
       length:32,
       trim:true 
    },
    lastname:{
        type:String,
        length:32,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    userinfo:{
        type:String,
        trim:true
    },
    encry_password:{
        type:String,
        required:true,
    },
    salt:String,
    role:{
        type:Number,
        default:0
    },
    purchases:{
        type:Array,
        default:[]
    }
},
{
    timestamps:true
});

userSchema.virtual("password")
          .set(function(password){
            this._password = password;
            this.salt = uuidv1();
            this.encry_password = this.securePassword(password);
            return this._password;
          })
          .get(function(){
              return this._password;
          })

userSchema.methods = {

     authenticate:function(rawPassword){
       return this.securePassword(rawPassword.password) === this.encry_password;
     },

    securePassword:function(rawPassword){
        if(!rawPassword) return "";
        try {
           return crypto.createHmac('sha256', this.salt)
                   .update(rawPassword)
                   .digest('hex');
        } catch (error) {
            return ""
        }
    }
}

module.exports = mongoose.model("User",userSchema);