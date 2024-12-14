import express from 'express';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';
import Blacklist from '../models/blackList.model.js';
import jwt from 'jsonwebtoken';
import { checkAuth } from '../utils/auth.js';


const router = express.Router();


router.post('/profile/logout', async (req, res) => {
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

router.get('/profile/:id', checkAuth, async (req, res) => {
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

router.put('/profile/edit/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;  // Get all update fields from request body

  try {
    // Find profile in either User or Company collection
    let profile = await User.findById(id);
    if (!profile) profile = await Company.findById(id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    // Loop through all fields in request body and update if they exist
    Object.keys(updateData).forEach(field => {
      if (updateData[field] !== undefined && profile[field] !== undefined) {
        profile[field] = updateData[field];
      }
    });

    // Save the updated profile
    await profile.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      payload: { user: profile }
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      message: 'Error in updating user profile.',
      error: error.message
    });
  }
});

export default router;