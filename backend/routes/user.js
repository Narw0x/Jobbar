import bcrypt from 'bcryptjs';
import express from 'express';
import User from '../models/user.model.js';

import { createJSONToken, isValidPassword} from '../utils/auth.js';
import { checkAuth } from '../utils/auth.js';

const router = express.Router();

router.post('/user/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });
      
      const isMatch = await isValidPassword(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      
      const token = createJSONToken(email);
      const { password: _, ...userWithoutPassword } = user.toObject();
      const exp = new Date().getTime() + 86400000;
      
      res.status(200).json({
        message: 'Login successful',
        payload: { user: userWithoutPassword, token, exp },
      });
    } catch (error) {
        res.status(500).send({ message: 'Error in logging in user.' });
    }
});

router.post('/user/register', async (req, res) => {
    const { firstName, lastName, email, password, gender, phoneNumber } = req.body;
    
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword, 
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