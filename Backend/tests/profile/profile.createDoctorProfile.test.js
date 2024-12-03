import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import User from '../../data/models/user.model.js';
import DoctorProfile from '../../data/models/profile/profile.doctor.js';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

let mongoServer;
let doctorToken;
let doctorUser;

const originalCloudinaryUpload = cloudinary.uploader.upload;

describe('Create Doctor Profile', () => {
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

    // Generate doctor JWT token
    doctorToken = jwt.sign({ userID: doctorUser._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(() => {
    // Restore the original Cloudinary upload method after each test
    cloudinary.uploader.upload = originalCloudinaryUpload;
  });

  describe('POST /create-doctor', () => {
    it('should successfully create a doctor profile', async () => {
      // Manually stub the Cloudinary upload method to return a mocked image URL
      cloudinary.uploader.upload = (imagePath, options) => {
        return new Promise((resolve) => {
          resolve({
            secure_url: 'https://mockcloudinary.com/doctor-image.jpg',
          });
        });
      };


      const response = await request(app)
        .post('/profile/create-doctor')
        .set('Cookie', `jwt=${doctorToken}`)
        .set('Content-Type', 'multipart/form-data')
        .field('specialty', 'Cardiology')
        .field('qualifications', 'MD, PhD')
        .field('experience', 10)
        .field('contactNumber', '9876543210')
        .field('clinicAddress[street]', '456 Elm St')
        .field('clinicAddress[city]', 'Metropolis')
        .field('clinicAddress[state]', 'NY')
        .field('clinicAddress[postalCode]', '10102')
        .field('clinicAddress[country]', 'USA')
        .field('ratings', 4.5)
        .field('biography', 'Experienced cardiologist specializing in heart diseases.')
        .field('consultationFee', 200)
        .attach('image', fs.readFileSync('./Utilites/uploads/image.jpeg'),'image.jpeg');

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Doctor profile Created successfully');

      const savedProfile = await DoctorProfile.findOne({ userID: doctorUser._id });
      expect(savedProfile).not.toBeNull();
      expect(savedProfile.specialty).toBe('Cardiology');
      expect(savedProfile.contactNumber).toBe('9876543210');
      expect(savedProfile.image).toBe('https://mockcloudinary.com/doctor-image.jpg');
    });

    it('should fail if required fields are missing', async () => {
      const response = await request(app)
        .post('/profile/create-doctor')
        .set('Cookie', `jwt=${doctorToken}`)
        .send({});

      expect(response.status).toBe(500);
      //expect(response.body.message).toBe('Error in creating the profile for Doctor');
    });
  });
});
