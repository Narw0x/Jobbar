import bcrypt from 'bcryptjs';
import express from 'express';
import Company from '../models/company.model.js';

import { createJSONToken, validateJSONToken, isValidPassword, checkAuth} from '../utils/auth.js';



const router = express.Router();

router.post('/company/login', async (req, res) => {
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


router.post('/company/register', async (req, res) => {
    const { companyName, email, password, address, phoneNumber } = req.body;
    try {
      // Check if company already exists
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) return res.status(400).json({ message: 'Company already exists' });
      // Hash the password before saving the company
      const hashedPassword = await bcrypt.hash(password, 16);
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

router.use(checkAuth);


router.put('/company/edit/:id', async (req, res) => {
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

router.delete('/company/delete/:id', async (req, res) => {
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
