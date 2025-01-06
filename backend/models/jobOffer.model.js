import mongoose from "mongoose";

const jobOfferSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: Object,
        required: true
    },
    employmentType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: Array,
        default: []
    },
    applicants: {
        type: Array,
        default: []
    },
    date: {
        type: String,
        required: true
    }
});

const JobOffer = mongoose.model('JobOffers', jobOfferSchema);

export default JobOffer;