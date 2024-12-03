import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import User from '../../data/models/user.model.js';
import DoctorProfile from '../../data/models/profile/profile.doctor.js';

let mongoServer;
let doctorToken;
let doctorUser;
let doctorProfile;

describe('GET /profile/get-doctor/:id', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Set a secret key for JWT if not already set
    if (!process.env.SECRET_JWT_KEY) {
      process.env.SECRET_JWT_KEY = 'test-jwt-secret';
    }

    // Create a doctor user
    doctorUser = await User.create({
      userName: 'Test Doctor',
      email: 'doctor@test.com',
      password: 'password123',
      role: 'Doctor',
    });

    // Create a doctor profile
    doctorProfile = await DoctorProfile.create({
      userID: doctorUser._id,
      specialty: 'Cardiologist',
      qualifications: 'MD',
      experience: 10,
      contactNumber: '9876543210',
      clinicAddress: {
        street: '456 Elm St',
        city: 'Gotham',
        state: 'NY',
        postalCode: '54321',
        country: 'USA',
      },
      ratings: 4.5,
      biography: 'Experienced in treating heart conditions',
      consultationFee: 100,
      image: 'https://mockcloudinary.com/image.jpg',
    });

    // Generate doctor JWT token
    doctorToken = jwt.sign({ userID: doctorUser._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should successfully fetch the doctor profile', async () => {
    const response = await request(app)
      .get(`/profile/get-doctor/${doctorProfile._id}`)
      .set('Cookie', `jwt=${doctorToken}`);

    expect(response.status).toBe(200);
  });

  it('should return an error if the doctor ID is invalid', async () => {
    const invalidDoctorId = new mongoose.Types.ObjectId(); // Generate a random invalid doctor ID
    const response = await request(app)
      .get(`/profile/get-doctor/${invalidDoctorId}`)
      .set('Cookie', `jwt=${doctorToken}`);

    expect(response.status).toBe(500);
    
  });
});
