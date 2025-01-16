import bcrypt from 'bcryptjs';
import express from 'express';
import Company from '../models/company.model.js';
import User from '../models/user.model.js';

import { checkAuth, createJSONToken, isValidPassword } from '../utils/auth.js';

const router = express.Router();



router.post('/company/register', async (req, res) => {
    const { companyName, email, password, address } = req.body;
    
    try {
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) return res.status(400).json({ message: 'Company already exists' });
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create new company
      const newCompany = new Company({
        companyName,
        email,
        password: hashedPassword, // store hashed password
        address,
      });
      await newCompany.save();
      res.status(201).json({ message: 'Company registered successfully', company: newCompany });
    } catch (error) {
      res.status(500).send({ message: {error} });
    }
});


export default router;
