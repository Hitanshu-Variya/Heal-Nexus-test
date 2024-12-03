import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken'; // For generating token
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import DoctorProfile from '../../data/models/profile/profile.doctor.js';
import User from '../../data/models/user.model.js';

let mongoServer;
let doctorToken; // Token for doctor authorization

describe('Doctor List Route Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    if (!process.env.SECRET_JWT_KEY) {
      process.env.SECRET_JWT_KEY = 'test-jwt-secret';
    }
    doctorToken = jwt.sign({ id: 'doctorId123' }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
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

  test('GET /doctor/doctor-list - should return a list of verified doctors', async () => {
    // Create mock data for doctors
    const doctorUser = await User.create({
      userName: 'Doctor User',
      email: 'doctor@doctor.com',
      password: 'password123',
      role: 'Doctor',
    });

    const doctorProfile = await DoctorProfile.create({
      userID: doctorUser._id,
      specialty: 'Cardiology',
      qualifications: ['MBBS', 'MD'],
      experience: 10,
      contactNumber: '1234567890',
      clinicAddress: { street: '456 Elm St', city: 'Gotham', state: 'NY', postalCode: '10002', country: 'USA' },
      image: 'doctor.jpg',
      available: true,
      isVerified: true,
    });

    // Send GET request to fetch doctor list
    const response = await request(app)
      .get('/patient/doctor-list')
      .set('Cookie', `jwt=${doctorToken}`);

    // Validate the response
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.doctorData).toHaveLength(1);
    expect(response.body.doctorData[0]).toHaveProperty('profile');
    expect(response.body.doctorData[0]).toHaveProperty('user');

    const profileData = response.body.doctorData[0].profile;
    const userData = response.body.doctorData[0].user;

    // Check doctor profile data
    expect(profileData).toHaveProperty('specialty', doctorProfile.specialty);
    expect(profileData).toHaveProperty('contactNumber', doctorProfile.contactNumber);
    expect(profileData.clinicAddress).toHaveProperty('street', doctorProfile.clinicAddress.street);

    // Check user data
    expect(userData).toHaveProperty('userName', doctorUser.userName);
  });
});
