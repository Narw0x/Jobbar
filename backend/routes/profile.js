import express from 'express';
import multer from 'multer';
import path from 'path';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';
import Blacklist from '../models/blackList.model.js';
import jwt from 'jsonwebtoken';
import { checkAuth } from '../utils/auth.js';

const router = express.Router();

const DEFAULT_AVATAR = '/avatar/default_profile.svg';
const DEFAULT_BG = '/background/default_bg.png';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Choose destination based on field name
    if (file.fieldname === 'bgImage') {
      cb(null, 'public/background/');
    } else if (file.fieldname === 'avatar') {
      cb(null, 'public/avatar/');
    } else {
      cb(null, 'public/');
    }
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};



const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});


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

router.put('/profile/edit/:id',
   checkAuth,
   upload.fields([
    { name: 'bgImage', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
  ]),
  async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;  // Get all update fields from request body

    try {
      // Find profile in either User or Company collection
      let profile = await User.findById(id);
      if (!profile) profile = await Company.findById(id);
      if (!profile) return res.status(404).json({ message: 'Profile not found' });

      if (req.files) {
        // Handle background image
        if (req.files.bgImage) {
          // Only delete old image if it's not the default
          if (profile.bgImage && profile.bgImage !== DEFAULT_BG) {
            const oldPath = path.join(__dirname, '..', 'public', profile.bgImage);
            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
            }
          }
          profile.bgImage = `/background/${req.files.bgImage[0].filename}`;
        }

        // Handle avatar
        if (req.files.avatar) {
          // Only delete old image if it's not the default
          if (profile.avatar && profile.avatar !== DEFAULT_AVATAR) {
            const oldPath = path.join(__dirname, '..', 'public', profile.avatar);
            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
            }
          }
          profile.avatar = `/avatar/${req.files.avatar[0].filename}`;
        }
      }

      Object.keys(updateData).forEach(field => {
        if (updateData[field] !== undefined && 
            profile[field] !== undefined && 
            field !== 'bgImage' && 
            field !== 'avatar') {
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