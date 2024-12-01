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
        default: "fabko.jpg"
    },
    bgImage: {
        type: String,
        default: "default_bg.png"
    },
    socialMedia: {
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    jobOffers: {
        type: Array,
        default: []
    },
}, {
    timestamps: true,
    collection: 'company'
});

const Company = mongoose.model('Company', companySchema);

export default Company;