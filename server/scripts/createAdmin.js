require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const adminExists = await Admin.findOne({ username: 'admin' });

        if (adminExists) {
            console.log('Admin user already exists');
        } else {
            // Create new admin
            const admin = new Admin({
                username: 'admin',
                password: 'admin123' // This will be hashed by the pre-save hook
            });

            await admin.save();
            console.log('Admin user created successfully');
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

createAdmin(); 