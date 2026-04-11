import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('Admin user already exists!');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      phone: '1234567890',
      address: '123 Admin Street, City',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('----------------------------------');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('----------------------------------');

    // Create sample student
    const studentExists = await User.findOne({ email: 'student@example.com' });
    
    if (!studentExists) {
      const student = await User.create({
        name: 'John Doe',
        email: 'student@example.com',
        password: 'student123',
        phone: '9876543210',
        address: '456 Student Avenue, City',
        class: 'Class 10',
        role: 'student'
      });

      console.log('✅ Sample student created successfully!');
      console.log('----------------------------------');
      console.log('Email: student@example.com');
      console.log('Password: student123');
      console.log('----------------------------------');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdminUser();
