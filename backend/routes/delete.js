import bcrypt from 'bcryptjs';
import express from 'express';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';

const router = express.Router();

// Delete user (password required for verification)
router.delete('/user/:id', async (req, res) => {
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

// Delete company (password required for verification)
router.delete('/company/:id', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    const company = await Company.findById(id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    // Check if password is provided and is valid
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });
    // Delete the company from the database
    await Company.findByIdAndDelete(id);
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error in deleting company.' });
  }
});

export default router;
