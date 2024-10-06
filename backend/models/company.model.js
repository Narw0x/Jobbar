import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    website: {
        type: String,
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
    jobOffers: {
        type: Array,
    },
    socialMedia: {
        type: Array,
    },
}, {
    timestamps: true
});

const Company = mongoose.model('Company', companySchema);

export default Company;