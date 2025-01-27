import express from 'express';
import Admin from '../models/admin.model.js';
import jwt from 'jsonwebtoken';
import Blacklist from '../models/blackList.model.js';
import JobOffer from '../models/jobOffer.model.js';
import JobApplicant from '../models/jobApplicant.model.js';

import { checkAuth, createJSONToken, isValidPassword } from '../utils/auth.js';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';
import Report from '../models/report.model.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';


const router = express.Router();

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
        if(user.length > 0) return res.status(200).json({ message: 'User fetched successfully', payload: {user:{_id: user[0]._id, userName: user[0].firstName, email: user[0].email}} });

        const company = await Company.find({ email: userEmail }).select('companyName email');
        if(company.length > 0) return res.status(200).json({ message: 'Company fetched successfully', payload: {user:{_id: company[0]._id, userName: company[0].companyName, email: company[0].email}} });


        res.status(404).json({ message: 'User not found' });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: error.message });
    }
});

router.get('/jobOffer/:companyEmail', checkAuth, async (req, res) => {
    const { companyEmail } = req.params;
    try {
        const company = await Company.findOne({ email: companyEmail });
        if(!company) return res.status(404).json({ message: 'Company not found' });
        const jobs = await JobOffer.find({ _id: { $in: company.jobOffers } });

        res.status(200).json({ message: 'Job offers fetched successfully', payload: { jobs } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/edit/:userId', checkAuth, async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).select('firstName lastName address about avatar bgImage email phoneNumber socialMedia website role');
        if(user) return res.status(200).json({ message: 'User fetched successfully', payload: { user } });

        const company = await Company.findById(userId).select('companyName address about avatar bgImage email phoneNumber socialMedia website role');
        if(company) return res.status(200).json({ message: 'Company fetched successfully', payload: { user: company } });

        res.status(404).json({ message: 'User not found' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.put('/edit/:userId', checkAuth, upload, async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, companyName, address, about, email, phoneNumber, socialMedia, website } = req.body;
    try {
        let profile = await User.findById(userId);
        if (!profile) profile = await Company.findById(userId);
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        console.log(req.files);

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
        const data = { firstName, lastName, companyName, address, about, website, socialMedia, phoneNumber, email };
        for (const key in data) {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                profile[key] = [...data[key]];
                }
                profile[key] = data[key];
            }
        }


        await profile.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
);

router.get('/reports', checkAuth, async (req, res) => {
    try {
      const reports = await Report.find();
  
      // Dynamically populate based on reportedEntityType and reportedByType
      for (let report of reports) {
        const reportedEntityModel = report.reportedEntityType === 'user' ? 'User' : 'Company';
        const reportedByModel = report.reportedByType === 'user' ? 'User' : 'Company';
  
        // Populate the 'reportedEntity' and 'reportedBy' fields based on the model
        await report.populate('reportedEntity', 'firstName lastName email companyName');
        await report.populate('reportedBy', 'firstName lastName email companyName');
        
        // Now replace the `reportedEntity` and `reportedBy` with the correct model data
        await report.populate({
          path: 'reportedEntity',
          model: reportedEntityModel,
          select: 'firstName lastName email companyName'
        });
        await report.populate({
          path: 'reportedBy',
          model: reportedByModel,
          select: 'firstName lastName email companyName'
        });
      }
  
      res.status(200).json({
        message: 'Reports fetched successfully',
        payload: { reports },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

router.get('/reports/:reportId', checkAuth, async (req, res) => {
    const { reportId } = req.params;
    try {
        const report = await Report.findById(reportId);

        const reportedEntityModel = report.reportedEntityType === 'user' ? 'User' : 'Company';
        const reportedByModel = report.reportedByType === 'user' ? 'User' : 'Company';
  
        // Populate the 'reportedEntity' and 'reportedBy' fields based on the model
        await report.populate('reportedEntity', 'firstName lastName email companyName');
        await report.populate('reportedBy', 'firstName lastName email companyName');
        
        // Now replace the `reportedEntity` and `reportedBy` with the correct model data
        await report.populate({
          path: 'reportedEntity',
          model: reportedEntityModel,
          select: 'firstName lastName email companyName'
        });
        await report.populate({
          path: 'reportedBy',
          model: reportedByModel,
          select: 'firstName lastName email companyName'
        });
            
        if (!report) return res.status(404).json({ message: 'Report not found' });

        res.status(200).json({ message: 'Report fetched successfully', payload: { report } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.put('/reports/:reportId', checkAuth, async (req, res) => {
    const { reportId } = req.params;
    const { status } = req.body;
    try {
        const report = await Report.findById(reportId);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        report.reportStatus = status;
        await report.save();

        res.status(200).json({ message: 'Report updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
  
  

router.post('/logout', async (req, res) => {
    try{
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
    }catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


router.post('/delete/:userId', checkAuth, async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if(user) {
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

            await User.deleteOne({ _id: userId });
            return res.status(200).json({ message: 'Profile deleted successfully' });
        }

        const company = await Company.findById(userId);
        if(company) {
            const jobOffers = await JobOffer.find({ companyId: company._id });
            const jobOfferIds = jobOffers.map(offer => offer._id);
        
            await JobApplicant.deleteMany({ jobOffer: { $in: jobOfferIds } });
            await JobOffer.deleteMany({ companyId: company._id });
        
            await Report.deleteMany({ 
              $or: [
                { reportedBy: company._id },
                { reportedEntity: company._id }
              ]
            });

            await Company.deleteOne({ _id: userId });

            return res.status(200).json({ message: 'Profile deleted successfully' });
        }

        res.status(404).json({ message: 'Profile not found' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});




export default router;