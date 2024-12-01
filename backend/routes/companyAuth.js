import bcrypt from 'bcryptjs';
import express from 'express';
import Company from '../models/company.model.js';

import { validateJSONToken, isValidPassword} from '../utils/auth.js';

const router = express.Router();


router.put('/company/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { email, companyName, contactNumber, password } = req.body;
    try {
      const company = await Company.findById(id);
      if (!company) return res.status(404).json({ message: 'Company not found' });
      // Check if password is provided and is valid
      const isMatch = await isValidPassword(password, company.password);
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
        const isMatch = await isValidPassword(password, company.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });
        // Delete the company from the database
        await Company.findByIdAndDelete(id);
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error in deleting company.' });
    }
});


export default router;