import bcrypt from 'bcryptjs';
import express from 'express';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';
const router = express.Router();

router.post('/user', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)  return res.status(400).json({ message: 'User not found' });
    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    // If email and password match
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).send({ message: 'Error in logging in user.' });
  }
});

router.post('/company', async (req, res) => {
    const { email, password } = req.body;
    try {
      const company = await Company.findOne({ email });
      if (!company) return res.status(400).json({ message: 'Company not found' });
      // Compare hashed passwords
      const isMatch = await bcrypt.compare(password, company.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      // If email and password match
      res.status(200).json({ message: 'Login successful', company });
    } catch (error) {
      res.status(500).send({ message: 'Error in logging in company.' });
    }
});

export default router;