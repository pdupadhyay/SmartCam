const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

router.post("/register", async (req, res) => {
    try{

       
     let user = await User.findOne({email:req.body.email})
        
         if(user){
             return res.status(400).json({email:"Email already exists"});
         } else{
             newUser = new User({
                 name:req.body.name,
                 password:req.body.password,
                 email:req.body.email,
                 role:'faculty',
                 fid:req.body.fid,
                 gender:req.body.gender,
                 dob:req.body.dob,
                 phone:req.body.phone,
             });
 
             const salt = await bcrypt.genSalt(10);
 
         newUser.password = await bcrypt.hash(newUser.password, salt);
         await newUser.save();
 
         res.status(201).json({ message: 'User registered successfully' });
 
     
         }
     } catch(err){
 
        console.log(err)
         res.status(500).json({ message: 'Server error' });
     }
 });

 module.exports = router;