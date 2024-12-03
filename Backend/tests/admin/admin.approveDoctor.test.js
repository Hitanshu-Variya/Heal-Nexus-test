import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken'; // For token generation
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import DoctorProfile from '../../data/models/profile/profile.doctor.js'; // Adjust the path to your models

let mongoServer;
let adminToken; // Token for authorization

describe('Admin Approve Doctor Route Tests', () => {
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

  test('PUT /admin/approve-doctor/:doctorID - should approve a valid doctor', async () => {
    // Create a test doctor
    const doctor = await DoctorProfile.create({
      userID: new mongoose.Types.ObjectId(),
      specialty: 'Cardiologist',
      isVerified: false,
      experience: 10,
      qualifications: ['MBBS', 'MD'],
      clinicAddress: {
        street: '123 Main St',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      },
    });

    // Send PUT request to approve the doctor
    const response = await request(app)
      .put(`/admin/approve-doctor/${doctor._id}`)
      .set('Cookie', `jwt=${adminToken}`);

    // Validate response
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);

    // Validate the doctor is now verified
    const updatedDoctor = await DoctorProfile.findById(doctor._id);
    expect(updatedDoctor.isVerified).toBe(true);
  });
});
