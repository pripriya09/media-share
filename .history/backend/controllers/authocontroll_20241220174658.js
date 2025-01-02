import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['superAdmin', 'admin', 'agent'],
    default: 'user',
  },
  otp: { type: String },
  otpExpiry: { type: Date },
});

const UserModel = mongoose.model('user', UserSchema);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Routes

// Register route
router.post('/register', async (req, res) => {
  const { name, username, email, password, role } = req.body;

  if (!password) {
    return res.status(400).send('Password is required');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpass = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    name,
    username,
    email,
    password: hashedpass,
    role: role || 'user',
  });

  try {
    const savedUser = await newUser.save();
    res.send(true);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send(false);
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });
  if (!user) return res.status(404).send('User not found');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).send('Invalid password');

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
  await user.save();

  // Send OTP email
  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
  };
console.log(mailOptions
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'OTP sent to your registered email', username });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    res.status(500).send('Failed to send OTP');
  }
});

// OTP verification route
router.post('/verify-otp', async (req, res) => {
  const { username, otp } = req.body;

  const user = await UserModel.findOne({ username });
  if (!user) return res.status(404).send('User not found');

  if (!user.otp || user.otpExpiry < new Date()) {
    return res.status(400).send('OTP expired or invalid');
  }

  if (user.otp !== otp) return res.status(400).send('Invalid OTP');

  // Clear OTP after successful verification
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.status(200).send({ message: 'OTP verified. Login successful' });
});

export default router;
