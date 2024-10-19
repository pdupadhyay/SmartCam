// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const facultyAttendance = require('../models/facultyAttendance');
const leaveApplication = require('../models/leaveApplication');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');

// Delete a faculty by their faculty_id
router.delete('/faculty/:faculty_id', verifyToken, roleCheck(['admin']), async (req, res) => {
  try {
    const facultyId = req.params.faculty_id;

    // Find the faculty user by their ID and role
    const faculty = await User.findOne({ _id: facultyId, role: 'faculty' });

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Delete the faculty user
    await User.deleteOne({ _id: facultyId, role: 'faculty' });

    // Optionally, delete related faculty attendance records
    await facultyAttendance.deleteMany({ faculty_id: facultyId });

    res.json({ message: 'Faculty and related attendance records deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all pending leave applications
router.get('/leave/pending', verifyToken, roleCheck(['admin']), async (req, res) => {
    try {
      const pendingLeaves = await leaveApplication.find({ status: 'Pending' });
      res.json(pendingLeaves);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

// Approve or Deny leave request
router.put('/leave/:leave_id', verifyToken, roleCheck(['admin']), async (req, res) => {
    try {
      const leaveId = req.params.leave_id;
      const { status } = req.body;
  
      // Ensure status is either 'Approved' or 'Denied'
      if (status !== 'Approved' && status !== 'Denied') {
        return res.status(400).json({ message: 'Invalid status. Must be either Approved or Denied.' });
      }
  
      // Find the leave application by its ID
      const leave = await leaveApplication.findById(leaveId);
  
      if (!leave) {
        return res.status(404).json({ message: 'Leave application not found' });
      }
  
      // Update the leave application status
      leave.status = status;
      leave.decisionBy = req.user.id;  // Admin ID from the JWT token
  
      // If approved, update the faculty attendance status
      if (status === 'Approved') {
        const fromDate = new Date(leaveApplication.fromDate);
        const toDate = new Date(leaveApplication.toDate);
        const facultyId = leaveApplication.faculty_id;
  
        // Loop through each date between fromDate and toDate
        for (let date = fromDate; date <= toDate; date.setDate(date.getDate() + 1)) {
          const attendanceDate = date.toISOString().split('T')[0];  // Convert to YYYY-MM-DD
  
          // Update the faculty's attendance status to 'L' for each leave date
          await FacultyAttendance.updateOne(
            { faculty_id: facultyId, attendanceDate: attendanceDate },
            { facultyStatus: 'L' },
            { upsert: true }  // Create a new attendance record if one doesn't exist
          );
        }
      }
  
      // Save the updated leave application
      await leave.save();
  
      res.json({ message: `Leave request has been ${status.toLowerCase()}`, leave });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

module.exports = router;
