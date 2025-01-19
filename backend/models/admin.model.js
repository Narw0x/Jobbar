import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: 'admin'
    }
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
    