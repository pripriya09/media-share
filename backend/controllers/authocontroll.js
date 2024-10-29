import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const router = express.Router();
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
});

const UserModel = mongoose.model('user', UserSchema);

router.post('/register', async (req, res) => {
  console.log(req.body);
  const { name, username, email, password } = req.body;

  // Check if password is provided
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
  });

  try {
    const savedUser = await newUser.save();
    console.log(savedUser);
    res.send(true);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send(false); // Internal Server Error
  }
});

router.post('/login', async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  // Check if password is provided
  if (!password) {
    return res.status(400).send('Password is required');
  }

  const logindata = await UserModel.findOne({ username });
  
  // Check if user exists
  if (!logindata) {
    return res.status(404).send('User not found'); // Not Found
  }

  const isUserValid = await bcrypt.compare(password, logindata.password);
  console.log(isUserValid);

  if (isUserValid) {
    res.send(true);
  } else {
    res.send(false);
  }
});

export default router;
