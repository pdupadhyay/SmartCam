const { getFaceEncoding } = require('../helpers/faceEncodingHelper');
const express = require("express");
const path = require('path');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const facultyAttendance=require("../models/facultyAttendance")
const leaveApplication = require('../models/leaveApplication');
const upload = require('../middlewares/multer');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

router.post("/register",upload.any('profilePicture'), async (req, res) => {
    try{

        
       
     let user = await User.findOne({email:req.body.email})
        
         if(user){
             return res.status(400).json({email:"Faculty already exists"});
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
 
         res.status(201).json({ message: 'Faculty registered successfully' });
 
     
         }
     } catch(err){
 
        console.log(err)
         res.status(500).json({ message: 'Server error' });
     }
 });


router.get('/profile', verifyToken, roleCheck(['faculty']), async (req, res) => {
    try {
      // Fetch the user's profile, ensuring the user is a faculty member
      const facultyProfile = await User.findOne({ _id: req.user.id, role: 'faculty' });
  
      if (!facultyProfile) {
        return res.status(404).json({ message: 'Faculty profile not found' });
      }
  
      res.json(facultyProfile);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });


// Update Faculty Profile
router.put('/profile', verifyToken, roleCheck(['faculty']), async (req, res) => {
    try {
      // Extract fields to update from the request body
      const { email, department, phone, dob, gender } = req.body;
  
      // Find the logged-in user by their ID and role
      const facultyProfile = await User.findOne({ _id: req.user.id, role: 'faculty' });
  
      if (!facultyProfile) {
        return res.status(404).json({ message: 'Faculty profile not found' });
      }
  
      // Update fields only if they are provided in the request
      if (email) facultyProfile.email = email;
      if (department) facultyProfile.department = department;
      if (phone) facultyProfile.phone = phone;
      if (dob) facultyProfile.dob = dob;
      if (gender) facultyProfile.gender = gender;
      
  
      // Save the updated profile
      await facultyProfile.save();
  
      res.json({ message: 'Profile updated successfully', facultyProfile });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

// Get attendance for a particular faculty by their faculty_id
router.get('/:faculty_id/attendance', verifyToken, roleCheck(['faculty', 'admin']), async (req, res) => {
    try {
      const facultyId = req.params.faculty_id;
  
      // Query for finding attendance records for the given faculty_id
      const attendanceRecords = await facultyAttendance.find({ faculty_id: facultyId });
  
      if (attendanceRecords.length === 0) {
        return res.status(404).json({ message: 'No attendance records found for this faculty' });
      }
  
      res.json(attendanceRecords);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

// Apply for leave
router.post('/leave', verifyToken, roleCheck(['faculty']), async (req, res) => {
    try {
      const { leaveDate, leaveReason } = req.body;
  
      // Ensure fromDate, toDate, and leaveReason are provided
    if (!fromDate || !toDate || !leaveReason) {
        return res.status(400).json({ message: 'Please provide all required details' });
      }
  
      // Create a new leave application
      const newLeave = new leaveApplication({
        faculty_id: req.user.id,  // Faculty ID from the JWT token
        fromDate,
        toDate,
        leaveReason,
      });
  
      // Save the leave application to the database
      await newLeave.save();
  
      res.status(201).json({ message: 'Leave application submitted successfully', newLeave });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  


  


 module.exports = router;