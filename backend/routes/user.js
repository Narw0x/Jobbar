import bcrypt from 'bcryptjs';
import express from 'express';
import User from '../models/user.model.js';

import { createJSONToken, validateJSONToken, isValidPassword, checkAuth} from '../utils/auth.js';

const router = express.Router();

router.post('/user/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)  return res.status(400).json({ message: 'User not found' });
        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, user.password);
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
      res.status(500).send({ message: 'Error in registering user.' });
    }
});

router.use(checkAuth);

router.put('/user/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { email, firstName, lastName, phoneNumber, password } = req.body;
    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      // Check if password is provided and is valid
      const isMatch = await bcrypt.compare(password, user.password);
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

router.delete('/user/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      // Check if password is provided and is valid
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid password' });
      // Delete the user from the database
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Error in deleting user.' });
    }
});

export default router;