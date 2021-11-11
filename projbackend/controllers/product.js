const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");//DO javascropt stuff
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
          if(err){
              return res.status(400).json({
                  error:"Product not found" 
              });
          } 
          req.product =  product;
          next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
       if(err){
          return res.status(400).json({
                  error: "Problem wiht image"  
          }); 
       } 

       //destrucure the fileds
       const {name, description, price, category, stock} = fields;
       if(!name || !description || !price || !category || !stock){
         res.status(400).json({
             error:"Please include all filds"
         }); 
       }

       
       let product = new Product(fields);
       

       //handel file here
       if(file.photo){
          if(file.photo.size > 3000000){// Max 3 MB 
             return res.status(400).json({
                error:"File size too big !"
             }); 
          }
          product.photo.data = fs.readFileSync(file.photo.path);
          product.photo.contentType = file.photo.type; 
       }

       //save to db
       product.save((err, product) => {
           if(err){
               res.status(400).json({
                   error: "Saving tshirt in Db failed !"
               });
           }
           res.json(product); 
       });
  });
} 

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
}

//middleware
exports.photo = (req,res,next) => {
    if(req.product.photo.data){
       res.set("Content-Type", req.product.photo.contentType);
       return res.send(req.product.photo.data); 
    }
    next();
}

exports.deleteProduct = (req, res) => {
   let product = req.product;
   product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error:"Failes to delete the product"
            })
        }

        res.json({
            message: "Deletion sucess!",deletedProduct
        });
   });
}

  
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
         if(err){
            return res.status(400).json({
                    error: "Problem wiht image"  
            }); 
         } 
         
         let product = req.product;
         //using of lodash
         product = _.extend(product, fields);
  
         //handel file here
         if(file.photo){
            if(file.photo.size > 3000000){// Max 3 MB 
               return res.status(400).json({
                  error:"File size too big !"
               }); 
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type; 
         }
  
         //save to db
         product.save((err, product) => {
             if(err){
                 res.status(400).json({
                     error: "Updation failed !"
                 });
             }
             res.json(product); 
         });
    });
}

exports.getAllProducts = (req,res) => {
   //-photo (hipen means dont select phpto)
   //photo (select photo)
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err, products) => {
        if(err){
            return res.status(400).json({
                error: "No product found"
            })
        }
        res.json(product);
    })
}
  

//this is litttle complicated Lesson 10/video 10 //update inventory
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map(prod => {
     //incerase the sold number , decrase the stock
     return {
        updateOne : {
            filter : {_id: prod._id},
            update: {
                $inc: {
                    stock: -prod.count, sold: +prod.count
                }
          }
         }    
     }
     
  });

  Product.bulkWrite(myOperations,{}, (err, products) => {
      if(err){
         res.status(400).json({
             error: "Bulk operation failed !"
         })
      }
      next();
  });
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {} , (err, category) => {
        if(err){
            res.status(400).json({
                error: "Failed to load category!"
            });
        }

        res.json(category);
    })
}