import express from 'express';
import Admin from '../models/admin.model.js';
import jwt from 'jsonwebtoken';
import Blacklist from '../models/blackList.model.js';

import { checkAuth, createJSONToken, isValidPassword } from '../utils/auth.js';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';
import Report from '../models/report.model.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try{
        const admin = await Admin.findOne({ email });
        if(!admin) return res.status(400).json({ message: 'Admin does not exist' });
        

        const isPasswordCorrect = await isValidPassword(password, admin.password);
        if(!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        const token = createJSONToken(email);
        const { password: _, ...userWithoutPassword } = admin.toObject();
        const exp = new Date().getTime() + 86400000;
        
        res.status(200).json({
        message: 'Login successful',
        payload: { admin: userWithoutPassword, token, exp },
        });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
});


router.get('/length', checkAuth, async (req, res) => {
    try {
        const users = await User.countDocuments();
        const companies = await Company.countDocuments();
        const reports = await Report.countDocuments();

        res.status(200).json({ message: 'Data length fetched successfully', payload: { users, companies, reports } });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/user/:userEmail', checkAuth, async (req, res) => {
    const { userEmail } = req.params;
    try {
        const user = await User.find({ email: userEmail }).select('firstName email');
        if(user.length > 0) return res.status(200).json({ message: 'User fetched successfully', payload: {user:{userName: user[0].firstName, email: user[0].email}} });

        const company = await Company.find({ email: userEmail }).select('companyName email');
        if(company.length > 0) return res.status(200).json({ message: 'Company fetched successfully', payload: {user:{userName: company[0].companyName, email: company[0].email}} });


        res.status(404).json({ message: 'User not found' });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: error.message });
    }
});

router.post('/logout', checkAuth, async (req, res) => {
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

  
    res.status(200).json({ message: 'Logged out successfully' });
});




export default router;