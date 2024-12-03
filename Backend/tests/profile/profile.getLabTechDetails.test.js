import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import User from '../../data/models/user.model.js';
import LabTechnicianProfile from '../../data/models/profile/profile.labTechnician.js';

let mongoServer;
let technicianToken;
let technicianUser;
let technicianProfile;

describe('GET /profile/get-lab-technician/:id', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Set a secret key for JWT if not already set
    if (!process.env.SECRET_JWT_KEY) {
      process.env.SECRET_JWT_KEY = 'test-jwt-secret';
    }

    // Create a lab technician user
    technicianUser = await User.create({
      userName: 'Test Technician',
      email: 'technician@test.com',
      password: 'password123',
      role: 'Lab-Technician',
    });

    // Create a lab technician profile
    technicianProfile = await LabTechnicianProfile.create({
      userID: technicianUser._id,
      qualifications: 'BSc in Medical Technology',
      associatedLab: 'Prime Health Labs',
      specialization: 'Hematology',
      contactNumber: '1234567890',
      address: {
        street: '123 Lab Street',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '54321',
        country: 'USA',
      },
      certifications: ['Certified Clinical Laboratory Technician', 'Phlebotomy Certification'],
      yearsOfExperience: 7,
      image: 'https://mockcloudinary.com/lab-technician-image.jpg',
    });

    // Generate lab technician JWT token
    technicianToken = jwt.sign({ userID: technicianUser._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should successfully fetch the lab technician profile', async () => {
    const response = await request(app)
      .get(`/profile/get-lab-technician/${technicianProfile._id}`)
      .set('Cookie', `jwt=${technicianToken}`);

    expect(response.status).toBe(200);
  });

  it('should return an error if the lab technician ID is invalid', async () => {
    const invalidTechnicianId = new mongoose.Types.ObjectId(); // Generate a random invalid technician ID
    const response = await request(app)
      .get(`/profile/get-lab-technician/${invalidTechnicianId}`)
      .set('Cookie', `jwt=${technicianToken}`);

    expect(response.status).toBe(500);
  });
});
