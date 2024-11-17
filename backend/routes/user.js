import bcrypt from 'bcryptjs';
import express from 'express';
import User from '../models/user.model.js';

import { createJSONToken, isValidPassword} from '../utils/auth.js';

const router = express.Router();

router.post('/user/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)  return res.status(400).json({ message: 'User not found' });

        // Compare hashed passwords
        const isMatch = await isValidPassword(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // If email and password match
        const token = createJSONToken(email);
        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        res.status(500).send({ message: 'Error in logging in user.' });
    }
});

router.post('/user/register', async (req, res) => {
    const { firstName, lastName, email, password, gender, phoneNumber } = req.body;
    
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      // Hash the password before saving the user
      const hashedPassword = await bcrypt.hash(password, 16);

      // Create new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword, // store hashed password
        gender,
        phoneNumber
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(501).send({ message: error });
    }
});


export default router;