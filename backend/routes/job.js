import express from 'express';
import { checkAuth } from '../utils/auth.js';
import Company from '../models/company.model.js';
import JobOffer from '../models/jobOffer.model.js';

const router = express.Router();

router.post('/job/create', checkAuth, async (req, res) => {
    const { jobTitle, company, employmentType, date, description, address, requirements, salary } = req.body;
    const {id} = req.headers;

    try {
        const profile = await Company.findById(id);
        if (!profile) return res.status(400).json({ message: 'Company not found' });

        const newJob = {
            jobTitle,
            company,
            employmentType,
            date,
            description,
            address,
            requirements,
            salary
        }

        // First create the job offer and get its ID
        const jobOffer = await JobOffer.create(newJob);

        // Then push the job offer's ID to the profile
        profile.jobOffers.push(jobOffer._id);  

        // Save the profile
        await profile.save();

        res.status(201).json({ message: 'Job created successfully', payload: {user: profile} });
    } catch (error) {
        console.log(error);
        
        res.status(500).send({ message: error });
    }

});


export default router;