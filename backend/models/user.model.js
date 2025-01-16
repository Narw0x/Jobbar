import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
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
    gender: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
    },
    about: {
        type: String,
        default: "A little about me...",
        trim: true
    },
    experience: {
        type: Array,
        default: []
    },
    education: {
        type: Object,
        default: {
            school: [],
            certificate: [],
            skill: []
        }
    },
    address: {
        type: String,
        trim: true,
        default: ''
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
    website: {
        type: String,
        trim: true,
        default: "https://www.example.com"
    },
    role: {
        type: String,
        default: "user"
    },
    application: {
        type: Array,
        default: []
    },
    searchConfig: {
        type: Object,
        default: {
            address: '',
            radius: '5',
            jobType: 'full-time',
            salary: 0,
            experience: '0-1'
        }
    }
}, {
    timestamps: true,
    collection: 'user'
});

const User = mongoose.model('User', userSchema);

export default User;