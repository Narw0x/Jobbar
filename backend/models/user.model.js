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
        required: true
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
        type: Array,
        default: []
    },
    avatar: {
        type: String,
        default: "fabko.jpg"
    },
    bgImage: {
        type: String,
        default: "default_bg.png"
    },
}, {
    timestamps: true,
    collection: 'user'
});

const User = mongoose.model('User', userSchema);

export default User;