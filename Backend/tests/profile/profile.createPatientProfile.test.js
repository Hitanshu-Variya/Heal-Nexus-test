import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import User from '../../data/models/user.model.js';
import PatientProfile from '../../data/models/profile/profile.patient.js';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

let mongoServer;
let patientToken;
let patientUser;

const originalCloudinaryUpload = cloudinary.uploader.upload;

describe('Create Patient Profile', () => {
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

    // Generate patient JWT token
    patientToken = jwt.sign({ userID: patientUser._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(() => {
    // Restore the original Cloudinary upload method after each test
    cloudinary.uploader.upload = originalCloudinaryUpload;
  });

  describe('POST /create-patient', () => {
    it('should successfully create a patient profile', async () => {
      // Manually stub the Cloudinary upload method to return a mocked image URL
      cloudinary.uploader.upload = (imagePath, options) => {
        return new Promise((resolve) => {
          resolve({
            secure_url: 'https://mockcloudinary.com/image.jpg',
          });
        });
      };
      const imagePath = '../../Utilites/uploads/1731767064810-Screenshot-from-2024-11-09-20-28-54.png';

      const response = await request(app)
        .post('/profile/create-patient')
        .set('Cookie', `jwt=${patientToken}`)
        .set('Content-Type', 'multipart/form-data')
        .field('age', 30)
        .field('gender', 'Male')
        .field('contactNumber', '1234567890')
        .field('emergencyContact', '9876543210')
        .field('address[street]', '123 Maple St')
        .field('address[city]', 'Metropolis')
        .field('address[state]', 'NY')
        .field('address[postalCode]', '10101')
        .field('address[country]', 'USA')
        .field('medicalHistory', 'No significant history')
        .attach('image', fs.readFileSync('./Utilites/uploads/img.png'),'img.png');

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Patient profile Created successfully');

      const savedProfile = await PatientProfile.findOne({ userID: patientUser._id });
      expect(savedProfile).not.toBeNull();
      expect(savedProfile.age).toBe(30);
      expect(savedProfile.gender).toBe('Male');
      expect(savedProfile.contactNumber).toBe('1234567890');
      expect(savedProfile.image).toBe('https://mockcloudinary.com/image.jpg');
    });

    it('should fail if required fields are missing', async () => {
      const response = await request(app)
        .post('/profile/create-patient')
        .set('Cookie', `jwt=${patientToken}`)
        .send({});

      expect(response.status).toBe(500);
      //expect(response.body.message).toBe('Error in creating the profile for Patient');
    });
  });
});
