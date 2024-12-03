import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import User from '../../data/models/user.model.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import DoctorProfile from '../../data/models/profile/profile.doctor.js';

let mongoServer;
let doctorToken;
let doctorUser;
let doctorProfile;

const originalCloudinaryUpload = cloudinary.uploader.upload;

describe('Update Patient Profile', () => {
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
    doctorUser = await User.create({
      userName: 'Test Patient',
      email: 'patient@test.com',
      password: 'password123',
      role: 'Patient',
    });

    // Create a patient profile
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

    // Generate patient JWT token
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

  describe('PUT /profile/update-patient', () => {
    it('should successfully update the patient profile', async () => {
      // Manually stub the Cloudinary upload method to return a mocked image URL
      cloudinary.uploader.upload = (imagePath, options) => {
        return new Promise((resolve) => {
          resolve({
            secure_url: 'https://mockcloudinary.com/new-image.jpg',
          });
        });
      };
      
      const updatedProfile = {
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
      ratings: 2.5,
      biography: 'Experienced in treating heart conditions',
      consultationFee: 501,
      image: 'https://mockcloudinary.com/image.jpg',
      };

      

      const response = await request(app)
        .put(`/profile/update-doctor/${doctorProfile._id}`)
        .set('Cookie', `jwt=${doctorToken}`)
        .set('Content-Type', 'multipart/form-data')
        .field('specialty', updatedProfile.specialty)
        .field('qualifications', updatedProfile.qualifications)
        .field('experience', updatedProfile.experience) // Assuming this is a number
        .field('contactNumber', updatedProfile.contactNumber)
        .field('clinicAddress[street]', updatedProfile.clinicAddress.street)
        .field('clinicAddress[city]', updatedProfile.clinicAddress.city)
        .field('clinicAddress[state]', updatedProfile.clinicAddress.state)
        .field('clinicAddress[postalCode]', updatedProfile.clinicAddress.postalCode)
        .field('clinicAddress[country]', updatedProfile.clinicAddress.country)
        .field('ratings', updatedProfile.ratings)
        .field('biography', updatedProfile.biography)
        .field('consultationFee', updatedProfile.consultationFee)
        .attach('image', fs.readFileSync('./Utilites/uploads/image.jpeg'),'image.jpeg');

      expect(response.status).toBe(200);
    });
  });
});
