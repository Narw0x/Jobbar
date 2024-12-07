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


router.put('/user/edit/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const { email, firstName, lastName, phoneNumber, password } = req.body;

    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Check if password is provided and is valid
      const isMatch = await isValidPassword(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid password', user });
      
      // Update fields if provided
      if (email) user.email = email;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phoneNumber) user.phoneNumber = phoneNumber;

      // Save the updated user data
      await user.save();
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).send({ message: 'Error in updating user.' });
    }
});

router.delete('/user/delete/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Check if password is provided and is valid
      const isMatch = await isValidPassword(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

      // Delete the user from the database
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Error in deleting user.' });
    }
});


export default router;