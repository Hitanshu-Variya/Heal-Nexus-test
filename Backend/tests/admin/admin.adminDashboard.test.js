// tests/admin/adminDashboard.test.js

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken'; // For generating token
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import PatientProfile from '../../data/models/profile/profile.patient.js';
import DoctorProfile from '../../data/models/profile/profile.doctor.js';
import Appointment from '../../data/models/appointment.models.js';
import User from '../../data/models/user.model.js';
import PharmacistProfile from '../../data/models/profile/profile.pharmacist.js';

let mongoServer;
let adminToken; // Token for authorization

describe('Admin Dashboard Route Tests', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    if (!process.env.SECRET_JWT_KEY) {
      process.env.SECRET_JWT_KEY = 'test-jwt-secret';
    }

    // Generate admin token for testing
    adminToken = jwt.sign({ id: 'adminId123', role: 'admin' }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Clear collections after each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      try {
        await collections[key].deleteMany({});
      } catch (err) {
        console.error(`Error clearing collection ${key}:`, err);
      }
    }
  });

  test('GET /admin/dashboard - should return dashboard data with success', async () => {
    // Create mock data
    const user = await User.create({
      userName: 'Admin User',
      email: 'admin@admin.com',
      password: 'password123',
      role: 'Admin',
    });

    const patient = await PatientProfile.create({
      userID: user._id,
      age: 30,
      gender: 'Male',
      address: { street: '123 Main St', city: 'Metropolis', state: 'NY', postalCode: '10001', country: 'USA' },
      image: 'patient.jpg',
    });

    const doctor = await DoctorProfile.create({
      userID: user._id,
      specialty: 'Cardiology',
      qualifications: ['MBBS', 'MD'],
      experience: 10,
      contactNumber: '1234567890',
      clinicAddress: { street: '456 Elm St', city: 'Gotham', state: 'NY', postalCode: '10002', country: 'USA' },
      image: 'doctor.jpg',
    });

    await Appointment.create({
      patientID: patient._id,
      doctorID: doctor._id,
      slotTime: '10:00 AM',
      slotDate: '2024-12-01',
      amount: 100,
      date: Date.now(),
      isCompleted: false,
    });

    // Send GET request to dashboard route with token
    const response = await request(app)
      .get('/admin/dashboard')
      .set('Cookie', `jwt=${adminToken}`);

    // Validate the response
    expect(response.status).toBe(200);
   
   
  });

});
