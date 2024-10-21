import bcrypt from 'bcryptjs';
import express from 'express';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';

const router = express.Router();

// Update user details (password required for verification)
router.put('/user/:id', async (req, res) => {
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

// Update company details (password required for verification)
router.put('/company/:id', async (req, res) => {
  const { id } = req.params;
  const { email, companyName, contactNumber, password } = req.body;
  try {
    const company = await Company.findById(id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    // Check if password is provided and is valid
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });
    // Update fields if provided
    if (email) company.email = email;
    if (companyName) company.companyName = companyName;
    if (contactNumber) company.contactNumber = contactNumber;
    // Save the updated company data
    await company.save();
    res.status(200).json({ message: 'Company updated successfully', company });
  } catch (error) {
    res.status(500).send({ message: 'Error in updating company.' });
  }
});

export default router;
