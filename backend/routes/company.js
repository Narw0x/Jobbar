import bcrypt from 'bcryptjs';
import express from 'express';
import Company from '../models/company.model.js';

import { checkAuth, createJSONToken, isValidPassword } from '../utils/auth.js';

const router = express.Router();

router.post('/company/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const company = await Company.findOne({ email });
      if (!company) return res.status(400).json({ message: 'Company not found' });

      const isMatch = await isValidPassword(password, company.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = createJSONToken(email);
      const { password: _, ...companyWithoutPassword } = company.toObject();
      const exp = new Date().getTime() + 86400000;
      
      res.status(200).json({
        message: 'Login successful',
        payload: { user: companyWithoutPassword, token, exp },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Error in logging in company.', error: error });
    }
});


router.post('/company/register', async (req, res) => {
    const { companyName, email, password, address, phoneNumber } = req.body;
    try {
      // Check if company already exists
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) return res.status(400).json({ message: 'Company already exists' });
      // Hash the password before saving the company
      const hashedPassword = await bcrypt.hash(password, 12);
      // Create new company
      const newCompany = new Company({
        companyName,
        email,
        password: hashedPassword, // store hashed password
        address,
        phoneNumber,
      });
      await newCompany.save();
      res.status(201).json({ message: 'Company registered successfully', company: newCompany });
    } catch (error) {
      res.status(500).send({ message: {error} });
    }
});


export default router;
