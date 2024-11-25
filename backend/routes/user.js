import bcrypt from 'bcryptjs';
import express from 'express';
import User from '../models/user.model.js';

import { createJSONToken, isValidPassword} from '../utils/auth.js';

const router = express.Router();

router.post('/user/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      // 1. Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });
      
      // 2. Compare the provided password with the hashed password in the database
      const isMatch = await isValidPassword(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      
      // 3. Generate a JSON token for user authentication
      const token = createJSONToken(email);

      // 4. Exclude the password from the user object before sending the response
      const { password: _, ...userWithoutPassword } = user.toObject();

      // 5. Make an expiration time for the token to expire in 1 day
      const exp = new Date().getTime() + 86400000;
      
      // 5. Send the success response
      res.status(200).json({
        message: 'Login successful',
        payload: { user: userWithoutPassword, token, exp },
      });
    } catch (error) {
        console.log(error);
        
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
      const hashedPassword = await bcrypt.hash(password, 12);

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