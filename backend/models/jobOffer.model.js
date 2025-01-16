import mongoose from "mongoose";

const jobOfferSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: undefined
        }
    },
    salary: {
        type: Object,
        required: true
    },
    employmentType: {
        type: String,
        required: true
    },
    experience: {
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
    skills: {
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
},
    {
        timestamps: true,
    }
);

const JobOffer = mongoose.model('JobOffers', jobOfferSchema);

export default JobOffer;