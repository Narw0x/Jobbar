import bcrypt from 'bcryptjs';
import express from 'express';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';
import sendEmail from '../utils/email.js';
import crypto  from 'crypto';
import { checkAuth, isValidPassword } from '../utils/auth.js';
import JobApplicant from '../models/jobApplicant.model.js';
import JobOffer from '../models/jobOffer.model.js';
import Report from '../models/report.model.js';
import Blacklist from '../models/blackList.model.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/user/register', async (req, res) => {
    const { firstName, lastName, email, password, gender } = req.body;
    
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) return res.status(400).json({ message: 'Company already exists' });

      const hashedPassword = await bcrypt.hash(password, 12);

      const verificationToken = crypto.randomBytes(32).toString('hex');

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword, 
        gender,
        verificationToken
      });

      await newUser.save();
      await sendEmail({
        email: email,
        subject: 'Jobbar Registration',
        message: 'Welcome to Jobbar',
        userName: firstName,
        verificationToken
      });

      res.status(201).json({ message: 'User registered successfully'});
    } catch (error) {
      console.log(error);
      
      res.status(501).send({ message: error });
    }
});


router.post('/user/delete', checkAuth, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!isValidPassword(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
  
    // Decode the token to get its expiration time
    const decoded = jwt.decode(token);
  
    if (!decoded || !decoded.exp) {
      return res.status(400).json({ message: 'Invalid token' });
    }
  
    const expiryDate = new Date(decoded.exp * 1000); // Convert exp from seconds to milliseconds
  
    // Save token in the blacklist with expiration
    await Blacklist.create({ token, createdAt: expiryDate });
    await Blacklist.deleteMany({ createdAt: { $lte: new Date() } });


    await JobApplicant.deleteMany({ applicant: user._id });
    
    await JobOffer.updateMany(
      { applicants: user._id },
      { $pull: { applicants: user._id } }
    );

    await Report.deleteMany({ 
      $or: [
        { reportedBy: user._id },
        { reportedEntity: user._id }
      ]
    });
    
    await User.deleteOne({ email });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during account deletion' });
  }
});

export default router;