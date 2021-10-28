const User = require("../models/user");
const Category = require("../models/category");

exports.getCategoryById = (req,res,next,id) => {
    
    Category.findById(id).exec((err,cate) => {
        if(err | !cate){
            return res.status(400).json({
                erro:"No category found in DB"
            })
        }

        //add parameter in req
        req.category = cate;
        next();
    })
}


exports.createCategory = (req,res) => {
    const category = new Category(req.body);     
  category.save((err, category) => {
    if(err){
        return res.status(400).json({
            erro:"Not Able to save category in DB!"
        })
    }

    return res.status(200).json({category});
  })
}

exports.getCategory = (req,res) => {
   return res.json(req.category); 
}

exports.getAllCategory = (req,res) => {
    Category.find().exec((err,cate) => {
        if(err){
            return res.status(400).json({
                erro:"No categoried found"
            })
        }

       return res.json({cate});
    })
 }


exports.updateCategory = (req,res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                error:'Failed to update category'
            })
        }

        return res.json({updatedCategory});
    })
 }

 exports.removeCategory = (req,res) => {
    const category = req.category;
  
    category.remove((err,category) => {
        if(err){
            return res.status(400).json({
                error:"Failed to delete this category"
            });
        }

        return res.json({
            message:"Successfully deleted !"
        })
    })
 }