import express from 'express';
import { checkAuth } from '../utils/auth.js';
import Company from '../models/company.model.js';
import JobOffer from '../models/jobOffer.model.js';

const router = express.Router();

router.get('/job/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
        const jobWithCompany = await JobOffer.findById(jobId).populate('companyId');
        if (!jobWithCompany) return res.status(400).json({ message: 'Job offer not found' });

        res.status(200).json({ message: 'Job found', payload: { job: jobWithCompany } });
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
    const { jobTitle, employmentType, date, description, address, requirements, salary } = req.body;
    const {id} = req.headers;

    try {
        const profile = await Company.findById(id);
        if (!profile) return res.status(400).json({ message: 'Company not found' });

        const newJob = {
            jobTitle,
            companyId: profile._id,
            employmentType,
            date,
            description,
            address,
            requirements,
            salary
        }

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
    const { jobTitle, company, employmentType, date, description, address, requirements, salary } = req.body;
    const {id} = req.headers;
    const { jobId } = req.params;

    try {
        const profile = await Company.findById(id);
        if (!profile) return res.status(400).json({ message: 'Company not found' });

        const jobOffer = await JobOffer.findById(jobId);
        if (!jobOffer) return res.status(400).json({ message: 'Job offer not found' });

        jobOffer.jobTitle = jobTitle;
        jobOffer.company = company;
        jobOffer.employmentType = employmentType;
        jobOffer.date = date;
        jobOffer.description = description;
        jobOffer.address = address;
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

        await JobOffer.deleteOne({ _id: jobId });

        profile.jobOffers = profile.jobOffers.filter((job) => job.toString() !== jobId);

        await profile.save();

        res.status(200).json({ message: 'Job deleted successfully', payload: { user: profile } });
    } catch (error) {
        res.status(500).send({ message: error });
    }
});


export default router;