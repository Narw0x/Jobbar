import bcrypt from 'bcryptjs';
const express = require('express');

const router = express.Router();

const User = require('../models/user.model');
const Company = require('../models/company.model');

// User Registration Route
router.post('/user', async (req, res) => {
    const { firstName, lastName, email, password, gender, phoneNumber } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password before saving the user
      const hashedPassword = await bcrypt.hash(password, 16);
  
      // Create new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword, // store hashed password
        gender,
        phoneNumber
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(500).send({ message: 'Error in registering user.' });
    }
});
  
// Company Registration Route
router.post('/register/company', async (req, res) => {
    const { companyName, email, password, address, phoneNumber, website, description, logo, jobOffers, socialMedia } = req.body;
  
    try {
      // Check if company already exists
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) {
        return res.status(400).json({ message: 'Company already exists' });
      }
  
      // Hash the password before saving the company
      const hashedPassword = await bcrypt.hash(password, 16);
  
      // Create new company
      const newCompany = new Company({
        companyName,
        email,
        password: hashedPassword, // store hashed password
        address,
        phoneNumber,
        website,
        description,
        logo,
        jobOffers,
        socialMedia
      });
  
      await newCompany.save();
  
      res.status(201).json({ message: 'Company registered successfully', company: newCompany });
    } catch (error) {
      res.status(500).send({ message: 'Error in registering company.' });
    }
  });

module.exports = router;