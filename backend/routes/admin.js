import express from 'express';
import Admin from '../models/admin.model.js';
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
        payload: { user: userWithoutPassword, token, exp },
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



export default router;