var mongooes = require("mongoose");
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
    }
);

module.exports = mongooes.model("User",userSchema);