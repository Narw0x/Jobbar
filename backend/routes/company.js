import bcrypt from 'bcryptjs';
import express from 'express';
import Company from '../models/company.model.js';
import User from '../models/user.model.js';
import sendEmail from '../utils/email.js';
import { isValidPassword } from '../utils/auth.js';
import JobOffer from '../models/jobOffer.model.js';
import JobApplicant from '../models/jobApplicant.model.js';
import crypto  from 'crypto';




const router = express.Router();



router.post('/company/register', async (req, res) => {
    const { companyName, email, password, address } = req.body;
    
    try {
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) return res.status(400).json({ message: 'Company already exists' });
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 12);

      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      // Create new company
      const newCompany = new Company({
        companyName,
        email,
        password: hashedPassword, // store hashed password
        address,
        verificationToken
      });
      await newCompany.save();

      await sendEmail({
        email: email,
        subject: 'Jobbar Registration',
        message: 'Welcome to Jobbar',
        userName: companyName,
        verificationToken
      });

      res.status(201).json({ message: 'Company registered successfully', company: newCompany });
    } catch (error) {
      res.status(500).send({ message: {error} });
    }
});

router.post('/company/delete', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const company = await Company.findOne({ email });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (!isValidPassword(password, company.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const jobOffers = await JobOffer.find({ companyId: company._id });
    const jobOfferIds = jobOffers.map(offer => offer._id);

    await JobApplicant.deleteMany({ jobOffer: { $in: jobOfferIds } });
    await JobOffer.deleteMany({ companyId: company._id });
    
    await Company.deleteOne({ email });

    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during account deletion' });
  }
});


export default router;
