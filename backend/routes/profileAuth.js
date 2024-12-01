import express from 'express';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';


const router = express.Router();


router.get('/profile/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let profile = await User.findById(id).select('-password');
        if (!profile) profile = await Company.findById(id).select('-password');
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.status(200).json({ message: 'User profile fetched successfully', payload: {user: profile} });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error in fetching user profile.', error: error.message });
    }
});

export default router;