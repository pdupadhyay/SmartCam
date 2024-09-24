const { getFaceEncoding } = require('../helpers/faceEncodingHelper');
const express = require("express");
const path = require('path');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const upload = require('../middlewares/multer');

router.post("/register",upload.any('profilePicture'), async (req, res) => {
    try{

        
       
     let user = await User.findOne({email:req.body.email})
        
         if(user){
             return res.status(400).json({email:"User already exists"});
         } else{
            if (req.files && req.files[0]) {
                imgPath = path.join(__dirname, '../uploads', req.files[0].filename);
            }
            let faceEncoding = null;
            if (imgPath) {
                try {
                    faceEncoding = await getFaceEncoding(imgPath);
                } catch (err) {
                    if (err === 'Error parsing facial encoding') {
                        // Handle specific error and send 500 response
                        return res.status(500).json({ message: 'Error parsing facial encoding' });
                    } else {
                        // Handle other errors from the Python process
                        return res.status(500).json({ message: 'Error processing facial encoding' });
                    }
                }
            }
             newUser = new User({
                 profilePicturePath:imgPath ? `/uploads/${req.files[0].filename}` : "",
                 name:req.body.name,
                 password:req.body.password,
                 email:req.body.email,
                 role:'faculty',
                 fid:req.body.fid,
                 gender:req.body.gender,
                 dob:req.body.dob,
                 phone:req.body.phone,
                 facialEncoding: faceEncoding,
                 
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