import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken'; // Import JWT for token generation
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import DoctorProfile from '../../data/models/profile/profile.doctor.js'; // Adjust the path to your models
import User from '../../data/models/user.model.js'; // Adjust the path to your models

let mongoServer;
let adminToken; // Token for authorization

describe('Admin Routes Tests', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    if (!process.env.SECRET_JWT_KEY) {
      process.env.SECRET_JWT_KEY = 'test-jwt-secret';
    }
    // Generate a valid token for testing
    adminToken = jwt.sign({ id: 'adminId123', role: 'admin' }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      try {
        await collections[key].deleteMany({});
      } catch (err) {
        console.error(`Error clearing collection ${key}:`, err);
      }
    }
  });

  test('GET /admin/get-verified-doctors - should return all unverified doctors with user data', async () => {
    // Create test users
    const user1 = await User.create({
      userName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    const user2 = await User.create({
      userName: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
    });

    // Create test doctor profiles
    await DoctorProfile.create({
      userID: user1._id,
      specialty: 'Cardiologist',
      isVerified: true,
      experience: 10,
      qualifications: ['MBBS', 'MD'],
      clinicAddress: {
        street: '123 Main St',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      },
      image: 'null',
    });

    await DoctorProfile.create({
      userID: user2._id,
      specialty: 'Dermatologist',
      isVerified: false,
      experience: 5,
      qualifications: ['MBBS', 'DCD'],
      clinicAddress: {
        street: '456 Elm St',
        city: 'Gotham',
        state: 'NJ',
        postalCode: '07001',
        country: 'USA',
      },
      image: 'null',
    });

    await DoctorProfile.create({
      userID: user1._id,
      specialty: 'Neurologist',
      isVerified: true,
      experience: 15,
      qualifications: ['MBBS', 'DM Neurology'],
      clinicAddress: {
        street: '789 Oak St',
        city: 'Star City',
        state: 'CA',
        postalCode: '90001',
        country: 'USA',
      },
      image: 'null',
    });

    // Send GET request with token
    const response = await request(app)
      .get('/admin/get-unverified-doctors')
        .set('Cookie', `jwt=${adminToken}`);

    // Validate response
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('doctorData');
    expect(response.body.doctorData).toHaveLength(1); // Only two verified doctors

    // Validate structure of returned data
    response.body.doctorData.forEach((doctor) => {
      expect(doctor).toHaveProperty('userData');
      expect(doctor.userData).toHaveProperty('userName');
      expect(doctor.userData).toHaveProperty('email');
    });
  });

  test('GET /admin/get-unverified-doctors - should return empty list if no unverified doctors', async () => {
    // Send GET request with token
    const response = await request(app)
      .get('/admin/get-unverified-doctors')
      .set('Cookie', `jwt=${adminToken}`);

    // Validate response
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.doctorData).toHaveLength(0);
  });
});
