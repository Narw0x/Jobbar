import express from 'express';
import Report from '../models/report.model.js';

const router = express.Router();

router.post('/report', async (req, res) => {
    const { _id, reason } = req.body;

    try {
        const newReport = new Report({
            title: 'Report User',
            reason,
            userId: _id
        });

        await newReport.save();

        res.status(201).json({ message: 'Report submitted successfully'});
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ error });
    }
});

export default router;