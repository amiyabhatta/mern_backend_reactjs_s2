var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');


const {signup, signin, signout, isSignIn} = require("../controllers/auth");


router.post('/signup', [
    check('name','Name should be atleast 3 charecter!').isLength({ min: 3 }),
    check('email','Not a valid email').isEmail(),
    // password must be at least 5 chars long
    check('password','Password should be atleast 5 charecter!').isLength({ min: 5 })
] ,signup);

router.post('/signin', [
    check('email','Not a valid email').isEmail(),
    // password must be at least 5 chars long
    check('password','Password should be atleast 5 charecter!').isLength({ min: 5 })
] ,signin);

router.get('/signout',signout);


router.get('/protected',isSignIn,(req,res) => {
    res.send(req.auth);
})
module.exports = router;