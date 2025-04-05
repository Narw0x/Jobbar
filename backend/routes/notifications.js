import express from 'express';
import cron from 'node-cron';
import User from '../models/user.model';
import JobOffer from '../models/jobOffer.model';
import sendEmail from '../utils/email.js';
import emailNotification from '../utils/emailNotifications.js';

const router = express.Router();

cron.schedule('0 7 * * *', async () => {
    try{
        const users = await User.find({ isNotified: true });
         users.forEach(user => async () => {
            const query = {
                address: user.notifications.address,
                radius: user.notifications.radius,
                salary: user.notifications.salary,
                field: user.notifications.field
            };

            const matchingJobs = await JobOffer.find({
                address: query.address,
                radius: query.radius,
                salary: { $gte: query.salary },
                field: query.field
            });

            if (matchingJobs.length > 0) {
                sendEmail({
                    email: user.email,
                    subject: `New Job Offers Matching Your Preferences`,
                    message: 'Job offers',
                    profile: user,
                    matchingJobs,
                    htmlCode: emailNotification,
                })
            }
        });
    } catch (error) {
        console.error('Error sending daily notifications:', error);
    }
},{
    scheduled: true,
    timezone: "Europe/Bucharest"
});

export default router;