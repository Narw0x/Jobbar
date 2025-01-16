import express from 'express';
import { checkAuth } from '../utils/auth.js';
import Company from '../models/company.model.js';
import JobOffer from '../models/jobOffer.model.js';
import User from '../models/user.model.js';
import JobApplicant from '../models/jobApplicant.model.js';

import  {getCoordinates, createSphere}  from '../utils/helper.js';


const router = express.Router();

// router.get('/jobs', async (req, res) => {
//     try {
//       // Extract search parameters from query params instead of headers
//       const { address, radius, jobType, salary, experience } = req.query;
  
//       // Input validation
//       if (!salary || !jobType) {
//         return res.status(400).json({
//           message: 'Missing required search parameters',
//           required: ['salary', 'jobType']
//         });
//       }
  
//       // Build query object dynamically
//       const query = {};
  
//       // Salary filter with numeric conversion
//       if (salary) {
//         query.salary = { $gte: parseFloat(salary) };
//       }
  
//       // Experience filter (assuming it's an array in string format like "1,2,3")
//       if (experience) {
//         query.experience = { $in: experience.split(',').map(exp => exp.trim()) };
//       }
  
//       // Job type filter
//       if (jobType) {
//         query.employmentType = jobType;
//       }
  
//       // Location-based search using MongoDB geospatial query
//       if (address && radius) {
//         // Assuming you have a function to convert address to coordinates
//         const coordinates = await getCoordinates(address);
//         query.location = {
//           $near: {
//             $geometry: {
//               type: "Point",
//               coordinates: [coordinates.longitude, coordinates.latitude]
//             },
//             $maxDistance: parseInt(radius) * 1000 // Convert km to meters
//           }
//         };
//       }
  
//       // Add pagination
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
//       const skip = (page - 1) * limit;
  
//       // Execute query with pagination
//       const jobs = await JobOffer.find(query)
//         .skip(skip)
//         .limit(limit)
//         .select('-__v') // Exclude version key
//         .lean(); // Convert to plain JavaScript objects
  
//       // Get total count for pagination
//       const total = await JobOffer.countDocuments(query);
  
//       // Send response with pagination metadata
//       res.status(200).json({
//         message: 'Jobs found',
//         payload: {
//           jobs,
//           pagination: {
//             total,
//             page,
//             limit,
//             pages: Math.ceil(total / limit)
//           }
//         }
//       });
  
//     } catch (error) {
//       console.error('Job search error:', error);
//       res.status(500).json({
//         message: 'An error occurred while searching for jobs',
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
//   });


router.post('/jobs', async (req, res) => {
    try {
        // Parse search configuration from headers
        const {searchConfig} = req.body;
        const { salary, jobType, experience, address, radius } = searchConfig;
        
        // Convert salary to number
        const salaryAmount = Number(salary);
        
        // Build base query
        const query = {
            'salary.amount': { $gte: salaryAmount },
            'employmentType': { $regex: jobType, $options: 'i' },
            'experience': { $regex: experience, $options: 'i' }
        };

        // Add location search if address and radius are provided
        if (address && radius) {
            try {
                const searchCoordinates = await getCoordinates(address);
                const jobs = await JobOffer.aggregate([
                    {
                        $geoNear: {
                            near: {
                                type: "Point",
                                coordinates: [searchCoordinates.longitude, searchCoordinates.latitude]
                            },
                            distanceField: "distance",
                            maxDistance: parseInt(radius) * 1000,
                            spherical: true,
                            query: query
                        }
                    }
                ]);

                return res.status(200).json({ 
                    message: 'Jobs found', 
                    payload: { 
                        jobs,
                        count: jobs.length 
                    } 
                });
            } catch (geocodingError) {
                console.error('Geocoding error:', geocodingError);
                return res.status(400).json({ 
                    message: 'Invalid address or geocoding error',
                    error: geocodingError.message 
                });
            }
        }

        // If no location search, use regular find
        const jobs = await JobOffer.find(query);
        
        res.status(200).json({ 
            message: 'Jobs found', 
            payload: { 
                jobs,
                count: jobs.length 
            } 
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
});

router.get('/job/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
        const jobWithCompany = await JobOffer.findById(jobId).populate('companyId');
        if (!jobWithCompany) return res.status(400).json({ message: 'Job offer not found' });

        let applicants = await JobApplicant.find({ jobOffer: jobId }).populate('applicant');

        res.status(200).json({ message: 'Job found', payload: { job: jobWithCompany, applicants } });
    } catch (error) {
        res.status(500).send({ message: error });
    }
});

router.get('/job/applicants/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
        const job = await JobOffer.findById(jobId);
        if (!job) return res.status(400).json({ message: 'Job offer not found' });

        const applicants = await JobApplicant.find({ jobOffer: jobId }).populate('applicant');
        res.status(200).json({ message: 'Applicants found', payload: { applicants } });
    }
    catch (error) {
        res.status(500).send({ message: error });
    }
});

router.get('/job/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {

        const jobs = await JobApplicant.find({ applicant: userId }).populate('jobOffer');
        if (!jobs) return res.status(400).json({ message: 'Jobs not found' });

        res.status(200).json({ message: 'Job found', payload: { jobs } });
    } catch (error) {
        res.status(500).send({ message: error });
    }
});

router.get('/jobs/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const profile = await Company.findById(userId);
        if (!profile) return res.status(400).json({ message: 'Company not found' });

        const jobs = await JobOffer.find({ _id: { $in: profile.jobOffers } });
        res.status(200).json({ message: 'Jobs found', payload: { jobs } });

    } catch (error) {
        res.status(500).send({ message: error });
    }
});




router.post('/job/create', checkAuth, async (req, res) => {
    const { jobTitle, employmentType, date, experience, description, address, requirements, skills, salary } = req.body;
    const {id} = req.headers;

    try {
        const profile = await Company.findById(id);
        if (!profile) return res.status(400).json({ message: 'Company not found' });

        const coordinates = await getCoordinates(address);

        const newJob = {
            jobTitle,
            companyId: profile._id,
            employmentType,
            date,
            experience,
            description,
            address,
            requirements,
            skills,
            salary,
            location: {
                type: 'Point',
                coordinates: [coordinates.longitude, coordinates.latitude]
            }
        }

        await createSphere();


        const jobOffer = await JobOffer.create(newJob);
        profile.jobOffers.push(jobOffer._id);  

        await profile.save();

        res.status(201).json({ message: 'Job created successfully', payload: {user: profile} });
    } catch (error) {
        console.log(error);
        
        res.status(500).send({ message: error });
    }

});

router.get('/job/edit/:jobId', checkAuth, async (req, res) => {
    const { jobId } = req.params;
    try {
        const job = await JobOffer.findById(jobId);
        if (!job) return res.status(400).json({ message: 'Job offer not found' });

        res.status(200).json({ message: 'Job found', payload: { job } });
    } catch (error) {
        res.status(500).send({ message: error });
    }
});

router.put('/job/edit/:jobId', checkAuth, async (req, res) => {
    const { jobTitle, companyId, employmentType, experience, date, description, address, skills, requirements, salary } = req.body;
    const {id} = req.headers;
    const { jobId } = req.params;

    try {
        const profile = await Company.findById(id);
        if (!profile) return res.status(400).json({ message: 'Company not found' });

        const jobOffer = await JobOffer.findById(jobId);
        if (!jobOffer) return res.status(400).json({ message: 'Job offer not found' });

        

        jobOffer.jobTitle = jobTitle;
        jobOffer.companyId = companyId;
        jobOffer.employmentType = employmentType;
        jobOffer.date = date;
        jobOffer.experience = experience;
        jobOffer.description = description;
        jobOffer.address = address;
        jobOffer.skills = skills;
        jobOffer.requirements = requirements;
        jobOffer.salary = salary;

        await jobOffer.save();

        res.status(201).json({ message: 'Job updated successfully', payload: { user: profile } });
    } catch (error) {
        res.status(500).send({ message: error });
    }
});

router.put('/job/delete/:jobId', checkAuth, async (req, res) => {
    const {id} = req.headers;
    const { jobId } = req.params;

    try {
        const profile = await Company.findById(id);
        if (!profile) return res.status(400).json({ message: 'Company not found' });

        const jobOffer = await JobOffer.findById(jobId);
        if (!jobOffer) return res.status(400).json({ message: 'Job offer not found' });

        const jobApplicants = await JobApplicant.find({ jobOffer: jobId });
        if (jobApplicants.length > 0){
            jobApplicants.forEach(async (applicant) => {
                const user = await User.findById(applicant.applicant);
                user.application = user.application.filter((job) => job.toString() !== jobId);
                await user.save();
            });
        }

        await JobApplicant.deleteMany({ jobOffer: jobId });
        await JobOffer.deleteOne({ _id: jobId });
        await JobOffer.deleteOne({ _id: jobId });

        profile.jobOffers = profile.jobOffers.filter((job) => job.toString() !== jobId);

        await profile.save();

        res.status(200).json({ message: 'Job deleted successfully', payload: { user: profile } });
    } catch (error) {
        res.status(500).send({ message: error });
    }
});


router.post('/job/apply/:jobId', checkAuth, async (req, res) => {
    const { id } = req.headers;
    const { jobId } = req.params;

    try {
      const profile = await User.findById(id);
      if (!profile) return res.status(404).json({ message: 'User not found' });
  
      const jobOffer = await JobOffer.findById(jobId);
      if (!jobOffer) return res.status(404).json({ message: 'Job offer not found' });
  
      const existingApplication = await JobApplicant.findOne({
        applicant: profile._id,
        jobOffer: jobOffer._id
      });
      if (existingApplication) return res.status(400).json({ message: 'You have already applied for this position' });
  
      // Create application
      const application = await JobApplicant.create({
        applicant: profile._id,
        jobOffer: jobOffer._id,
        status: 'Pending'
      });
  
      // Update job offer with new applicant
      await JobOffer.findByIdAndUpdate(jobId, {
        $push: { applicants: profile._id }
      });
  
      // Update user's applications
      await User.findByIdAndUpdate(id, {
        $push: { application: jobId }
      });
  
      return res.status(201).json({
        message: 'Applied successfully',
      });
  
    } catch (error) {
      console.error('Job application error:', error);
      return res.status(500).json({ 
        message: 'An error occurred while processing your application' 
      });
    }
});


export default router;