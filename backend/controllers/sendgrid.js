// import express from 'express';
// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';
// import sgMail from '@sendgrid/mail';
// import crypto from 'crypto';
// // import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// dotenv.config();

// const router = express.Router();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Your SendGrid API Key

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     enum: ['superAdmin', 'admin', 'agent'], 
//     default: 'user', 
//   },
//   otp: { type: String },
//   otpExpiry: { type: Date },
// });

// const UserModel = mongoose.model('user', UserSchema);

// // Function to send OTP email
// const sendOtpEmail = async (email, otp) => {
//   const message = {
//     to: email,
//     from: process.env.EMAIL_FROM, // Your verified sender email in SendGrid
//     subject: 'Your OTP for Login',
//     text: `Your OTP is ${otp}. It is valid for 15 minutes.`,
//   };
//   await sgMail.send(message);
// };


// router.post('/register', async (req, res) => {
//   console.log(req.body);
//   const { name, username, email, password, role } = req.body;

//   // Check if password is provided
//   if (!password) {
//     return res.status(400).send('Password is required');
//   }

//   const salt = await bcrypt.genSalt(10);
//   const hashedpass = await bcrypt.hash(password, salt);

//   const newUser = new UserModel({
//     name,
//     username,
//     email,
//     password: hashedpass,
//     role: req.body.role || 'user',
//   });

//   try {
//     const savedUser = await newUser.save();
//     console.log(savedUser);
//     res.send(true);
//   } catch (error) {
//     console.error('Error saving user:', error);
//     res.status(500).send(false); // Internal Server Error
//   }
// });


// router.post('/login', async (req, res) => {
//   console.log(req.body);
//   const { username, password } = req.body;

//   // Check if password is provided
//   if (!password) {
//     return res.status(400).send('Password is required');
//   }

//   const logindata = await UserModel.findOne({ username });
  
//   // Check if user exists
//   if (!logindata) {
//     return res.status(404).send('User not found'); // Not Found
//   }

//   const isUserValid = await bcrypt.compare(password, logindata.password);
//   console.log(isUserValid);

//   if (isUserValid) {
//     res.send(true);
 
//   } else {
//     res.send(false);
//   }

//  // Generate OTP
//  const otp = crypto.randomInt(100000, 999999).toString();
//  user.otp = otp;
//  user.otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes
//  await user.save();

//  // Send OTP email
//  try {
//    await sendOtpEmail(user.email, otp);
//    res.status(200).send({ message: 'OTP sent to your email. Please verify it.' });
//  } catch (error) {
//    res.status(500).send('Error sending OTP');
//  }
// });

// // OTP Verification Route
// router.post('/verify-otp', async (req, res) => {
//   const { username, otp } = req.body;

//   const user = await UserModel.findOne({ username });

//   if (!user) {
//     return res.status(404).send('User not found');
//   }

//   if (user.otp !== otp || user.otpExpiry < new Date()) {
//     return res.status(400).send('Invalid or expired OTP');
//   }

//   // Clear OTP after successful verification
//   user.otp = null;
//   user.otpExpiry = null;
//   await user.save();

//   res.status(200).send('OTP verified. Login successful.');
// });


// export default router;
