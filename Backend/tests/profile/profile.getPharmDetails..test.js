import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import User from '../../data/models/user.model.js';
import PharmacistProfile from '../../data/models/profile/profile.pharmacist.js';

let mongoServer;
let pharmacistToken;
let pharmacistUser;
let pharmacistProfile;

describe('GET /profile/get-pharmacist/:id', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Set a secret key for JWT if not already set
    if (!process.env.SECRET_JWT_KEY) {
      process.env.SECRET_JWT_KEY = 'test-jwt-secret';
    }

    // Create a pharmacist user
    pharmacistUser = await User.create({
      userName: 'Test Pharmacist',
      email: 'pharmacist@test.com',
      password: 'password123',
      role: 'Pharmacist',
    });

    // Create a pharmacist profile
    pharmacistProfile = await PharmacistProfile.create({
      userID: pharmacistUser._id,
      certification: 'Pharm.D',
      pharmacyName: 'Test Pharmacy',
      pharmacyLocation: {
        street: '123 Test St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62704',
        country: 'USA',
      },
      contactNumber: '9876543210',
      yearsOfExperience: 5,
      image: 'https://mockcloudinary.com/mock-image.jpg',
    });

    // Generate pharmacist JWT token
    pharmacistToken = jwt.sign({ userID: pharmacistUser._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should successfully fetch the pharmacist profile', async () => {
    const response = await request(app)
      .get(`/profile/get-pharmacist/${pharmacistProfile._id}`)
      .set('Cookie', `jwt=${pharmacistToken}`);

    expect(response.status).toBe(200);
  });

  it('should return an error if the pharmacist ID is invalid', async () => {
    const invalidPharmacistId = new mongoose.Types.ObjectId(); // Generate a random invalid pharmacist ID
    const response = await request(app)
      .get(`/profile/get-pharmacist/${invalidPharmacistId}`)
      .set('Cookie', `jwt=${pharmacistToken}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error: Error in getting the profile for Pharmacist');
  });
});
