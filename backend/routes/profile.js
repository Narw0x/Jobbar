import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';
import Blacklist from '../models/blackList.model.js';
import jwt from 'jsonwebtoken';
import { checkAuth } from '../utils/auth.js';
import { isValidObjectId } from 'mongoose';
import { isValidPassword } from '../utils/auth.js';
import { createJSONToken } from '../utils/auth.js';


const router = express.Router();


router.post('/profile/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) user = await Company.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await isValidPassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = createJSONToken(email);
    const { password: _, ...userWithoutPassword } = user.toObject();
    const exp = new Date().getTime() + 86400000;
    
    res.status(200).json({
      message: 'Login successful',
      payload: { user: userWithoutPassword, token, exp },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error in logging in company.', error: error });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create directories if they don't exist
    const backgroundDir = 'public/background';
    const avatarDir = 'public/avatar';
    
    if (!fs.existsSync(backgroundDir)) {
      fs.mkdirSync(backgroundDir, { recursive: true });
    }
    if (!fs.existsSync(avatarDir)) {
      fs.mkdirSync(avatarDir, { recursive: true });
    }

    if (file.fieldname === 'bgImage') {
      cb(null, backgroundDir);
    } else if (file.fieldname === 'avatar') {
      cb(null, avatarDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).fields([
  { name: 'bgImage', maxCount: 1 },
  { name: 'avatar', maxCount: 1 }
]);


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
        if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user ID', isValid: false });
        let profile = await User.findById(id).select('-password');
        if (!profile) profile = await Company.findById(id).select('-password');
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.status(200).json({ message: 'User profile fetched successfully', payload: {user: profile} });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error in fetching user profile.', error: error.message });
    }
});

router.put('/profile/edit/:id', checkAuth, upload, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, address, about, phone, website, socialMedia } = req.body;

  try {
    let profile = await User.findById(id);
    if (!profile) profile = await Company.findById(id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (req.files) {
      // Background Image
      if (req.files.bgImage && req.files.bgImage[0]) {
        const oldBgImage = profile.bgImage;
        profile.bgImage = req.files.bgImage[0].filename;

        // Delete the old background image
        if(oldBgImage && fs.existsSync(`public/background/${oldBgImage}` && oldBgImage !== 'default_bg.png')) {
          fs.unlinkSync(`public/background/${oldBgImage}`);
        }
      }

      // Avatar
      if (req.files.avatar && req.files.avatar[0]) {
        const oldAvatar = profile.avatar;
        profile.avatar = req.files.avatar[0].filename;

        // Delete the old avatar
        if (oldAvatar && fs.existsSync(`public/avatar/${oldAvatar}`) && oldAvatar !== 'default_profile.svg') {
          fs.unlinkSync(`public/avatar/${oldAvatar}`);
        }
      }
    }

    // Handle other form data
    const data = { firstName, lastName, address, about, phone, website, socialMedia };
    for (const key in data) {
      if (data[key]) {
        if (Array.isArray(data[key])) {
          profile[key] = [...data[key]];
        }
        profile[key] = data[key];
      }
    }


    await profile.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      payload: { user: profile }
    });
  } catch (error) {
    console.error('Error in profile update:', error);
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message
    });
  }
});


router.put('/profile/experience/add', checkAuth, async (req, res) => {
  const { jobTitle, company, employmentType, date, description } = req.body;
  const { id } = req.headers;

  try {
    let profile = await User.findById(id);
    if (!profile) profile = await Company.findById(id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const experienceId = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');

    profile.experience.unshift({ experienceId, jobTitle, company, employmentType, date, description });

    await profile.save();
    res.status(200).json({
      message: 'Experience added successfully',
      payload: { user: profile }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

router.put('/profile/experience/edit/:experienceId', checkAuth, async (req, res) => {
  const { jobTitle, company, employmentType, date, description } = req.body;
  const { id } = req.headers;
  const { experienceId } = req.params;

  try {
    let profile = await User.findById(id);
    if (!profile) profile = await Company.findById(id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const experienceIndex = profile.experience.findIndex(exp => exp.experienceId === experienceId);
    if (experienceIndex === -1) return res.status(404).json({ message: 'Experience not found' });

    profile.experience[experienceIndex] = { experienceId, jobTitle, company, employmentType, date, description };

    await profile.save();
    res.status(200).json({
      message: 'Experience updated successfully',
      payload: { user: profile }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});


router.put('/profile/experience/delete/:experienceId', checkAuth, async (req, res) => {
  const { id } = req.headers;
  const { experienceId } = req.params;

  try {
    let profile = await User.findById(id);
    if (!profile) profile = await Company.findById(id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const experienceIndex = profile.experience.findIndex(exp => exp.experienceId === experienceId);
    if (experienceIndex === -1) return res.status(404).json({ message: 'Experience not found' });

    profile.experience.splice(experienceIndex, 1);

    await profile.save();
    res.status(200).json({
      message: 'Experience deleted successfully',
      payload: { user: profile }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});


router.post('/profile/education/add', checkAuth, async (req, res) => {
  const {educationType} = req.body;
  const { id } = req.headers;

  try {
    let profile = await User.findById(id);
    if (!profile) profile = await Company.findById(id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    
    const educationId = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    const newEducation = { educationId, ...req.body };

    switch (educationType) {
        case 'school':
            profile.education.school.unshift(newEducation);
            break;
        case 'certificate':
            profile.education.certificate.unshift(newEducation);
            break;
        case 'skill':
            profile.education.skill.unshift(newEducation);
            break;
        default:
            return res.status(400).json({ message: 'Invalid education type' });
    }

    profile.markModified('education');
        
    await profile.save();
    
    res.status(200).json({
      message: 'Education added successfully',
      payload: { user: profile }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});


router.put('/profile/education/edit/:educationId', checkAuth, async (req, res) => {
  const { educationType } = req.body;
  const { id } = req.headers;
  const { educationId } = req.params;

  try {
    let profile = await User.findById(id);
    if (!profile) profile = await Company.findById(id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    let educationArray;
    switch (educationType) {
        case 'school':
            educationArray = profile.education.school;
            break;
        case 'certificate':
            educationArray = profile.education.certificate;
            break;
        case 'skill':
            educationArray = profile.education.skill;
            break;
        default:
            return res.status(400).json({ message: 'Invalid education type' });
    }

    const educationIndex = educationArray.findIndex(edu => edu.educationId === educationId);
    if (educationIndex === -1) return res.status(404).json({ message: 'Education not found' });

    educationArray[educationIndex] = { educationId, ...req.body };

    profile.markModified('education');

    await profile.save();
    res.status(200).json({
      message: 'Education updated successfully',
      payload: { user: profile }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

router.put('/profile/education/delete/:educationId', checkAuth, async (req, res) => {
  const { id } = req.headers;
  const { educationId } = req.params;

  try {
    let profile = await User.findById(id);
    if (!profile) profile = await Company.findById(id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    let educationIndex = profile.education.school.findIndex(edu => edu.educationId === educationId);
    let educationType = 'school';
    if (educationIndex === -1) {
        educationType = 'certificate';
        educationIndex = profile.education.certificate.findIndex(edu => edu.educationId === educationId);
    }
    if (educationIndex === -1) {
        educationType = 'skill';
        educationIndex = profile.education.skill.findIndex(edu => edu.educationId === educationId);
    }
    
    if (educationIndex === -1) return res.status(404).json({ message: 'Education not found' });

    switch (educationType) {
        case 'school':
            profile.education.school.splice(educationIndex, 1);
            break;
        case 'certificate':
            profile.education.certificate.splice(educationIndex, 1);
            break;
        case 'skill':
            profile.education.skill.splice(educationIndex, 1);
            break;
        default:
            return res.status(400).json({ message: 'Invalid education type' });
    }

    profile.markModified('education');
    
    await profile.save();

    res.status(200).json({
      message: 'Education deleted successfully',
      payload: { user: profile }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});






export default router;