import mongoose from 'mongoose';

const jobApplicantSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobOffer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobOffers',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
        default: 'Pending',
        required: true
    },
    appliedAt: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true
});

const JobApplicant = mongoose.model('JobApplicant', jobApplicantSchema);

export default JobApplicant;