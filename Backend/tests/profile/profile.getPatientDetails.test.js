import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import User from '../../data/models/user.model.js';
import PatientProfile from '../../data/models/profile/profile.patient.js';

let mongoServer;
let patientToken;
let patientUser;
let patientProfile;

describe('GET /profile/get-patient', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Set a secret key for JWT if not already set
    if (!process.env.SECRET_JWT_KEY) {
      process.env.SECRET_JWT_KEY = 'test-jwt-secret';
    }

    // Create a patient user
    patientUser = await User.create({
      userName: 'Test Patient',
      email: 'patient@test.com',
      password: 'password123',
      role: 'Patient',
    });

    // Create a patient profile
    patientProfile = await PatientProfile.create({
      userID: patientUser._id,
      age: 30,
      gender: 'Male',
      contactNumber: '1234567890',
      emergencyContact: '9876543210',
      address: {
        street: '123 Maple St',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10101',
        country: 'USA',
      },
      medicalHistory: 'No significant history',
      image: 'https://mockcloudinary.com/image.jpg',
    });

    // Generate patient JWT token
    patientToken = jwt.sign({ userID: patientUser._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should successfully fetch the patient profile', async () => {
    const response = await request(app)
      .get('/profile/get-patient')
      .set('Cookie', `jwt=${patientToken}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(patientUser.email);
    expect(response.body.age).toBe(patientProfile.age);
    expect(response.body.gender).toBe(patientProfile.gender);
    expect(response.body.contactNumber).toBe(patientProfile.contactNumber);
    expect(response.body.address.street).toBe(patientProfile.address.street);
    expect(response.body.image).toBe(patientProfile.image);
  });

  it('should return an error if the user ID is invalid', async () => {
    const invalidToken = jwt.sign({ userID: new mongoose.Types.ObjectId() }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });

    const response = await request(app)
      .get('/profile/get-patient')
      .set('Cookie', `jwt=${invalidToken}`);

    expect(response.status).toBe(500);
    //expect(response.body.message).toBe('Error in getting the profile for Patient');
  });
});
