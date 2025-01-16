import bcrypt from 'bcryptjs';
import express from 'express';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';

const router = express.Router();

router.post('/user/register', async (req, res) => {
    const { firstName, lastName, email, password, gender } = req.body;
    
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) return res.status(400).json({ message: 'Company already exists' });

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword, 
        gender,
      });
      await newUser.save();

      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(501).send({ message: error });
    }
});


export default router;