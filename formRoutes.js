// routes/formRoutes.js

const express = require('express');
const router = express.Router();
const FormData = require('./FormData');
const jwt = require('jsonwebtoken');
const { emailSender } = require('./emailSend');
const App = require('./app');
 
// POST /api/formsubmit
router.post('/formsubmit', async (req, res) => {
  try {
    const { name, email, phone, workType, hasLaptop, hasMobile } = req.body;

    // Log the form data for debugging
    console.log("Form Data:", { name, email, phone, workType, hasLaptop, hasMobile });

    // Check if required fields are present
    if (!name || !email || !phone || !workType || !hasLaptop || !hasMobile) {
      return res.status(203).json({ message: 'All fields are required' });
    }
    const password = Math.floor(100000 + Math.random() * 900000);
    // Create a new FormData document
    const newFormData = new FormData({
      name,
      email,
      password: password,
      phone,
      workType,
      hasLaptop,
      hasMobile,
    });

    // Save the document to the database
    await newFormData.save();
    emailSender.sentPassword(newFormData.email, newFormData.name, password);
    // Send success response
    res.status(200).json({ message: 'Account Created. Go To Login Page.' });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(203).json({ message: 'Duplicate User', message: error.message });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log(userName, password)
    // Find the user by email or mobile
    const user = await FormData.findOne({ $or: [{ email: userName }, { phone: userName }] });

    if (!user) {
      // If no user is found, send a failure response
      return res.status(203).json({ message: 'Invalid username or email' });
    }

    // Compare the hashed password


    if (user.password !== password) {
      // If the password doesn't match, send a failure response
      return res.status(203).json({ message: 'Invalid password' });
    }

    // Optionally, create a JWT token (replace 'secretKey' with an actual secret)
    const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '365d' });

    // Send success response with the token
    res.status(200).json({ message: 'Login successful', userToken: token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
 
router.post('/user-details', async (req, res) => {
  try {
    const { userToken } = req.body;
   
    // Check if token is provided
    if (!userToken) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(userToken, 'yourSecretKey');
    const userId = decoded.userId;

    // Fetch the user by ID
    const user = await FormData.findById(userId).select('-password'); // Exclude password field

    // If user not found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user details (without sensitive info like password)
    res.status(200).json({ details: user });
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

 
router.get('/', App.helloWorld);
router.post('/adminLogin', App.adminLogin);
 

 router.post('/user-details', App.userDetails);
router.post('/withdraw-request', App.widReq);
router.post('/sendRev', App.sendRev);
router.post('/all-withdraw-request', App.auth, App.allWidReq);
router.post('/withdrawals-history', App.getWithdrawalHistory);
router.post('/users', App.auth, App.allUsers);
router.post('/users/search', App.auth, App.searchUsers);
router.put('/users/:id', App.auth, App.editUsers);
router.put('/edit-status-withdraw-request/:id', App.auth, App.editUsersStatusWithdrawRequest);
 module.exports = router;
 