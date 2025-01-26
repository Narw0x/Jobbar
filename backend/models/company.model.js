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
    },
    website: {
        type: String,
        trim: true,
        default: "https://www.example.com"
    },
    about: {
        type: String,
        default: "A little about us...",
        trim: true
    },
    avatar: {
        type: String,
        default: "default_profile.svg"
    },
    bgImage: {
        type: String,
        default: "default_bg.png"
    },
    socialMedia: {
        type: Object,
        default: {
            twitter: '',
            instagram: '', 
            github: ''
        }
    },
    jobOffers: {
        type: Array,
        default: []
    },
    role: {
        type: String,
        default: 'company'
    },
    favoriteApplicants: {
        type: Array,
        default: []
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
    }
}, {
    timestamps: true,
    collection: 'company'
});

const Company = mongoose.model('Company', companySchema);

export default Company;