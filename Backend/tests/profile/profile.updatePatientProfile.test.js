import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import User from '../../data/models/user.model.js';
import PatientProfile from '../../data/models/profile/profile.patient.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

let mongoServer;
let patientToken;
let patientUser;
let patientProfile;

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
      image: 'https://mockcloudinary.com/old-image.jpg',
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
        age: 35,
        gender: 'Female',
        contactNumber: '0987654321',
        emergencyContact: '1122334455',
        address: {
          street: '456 Oak St',
          city: 'Gotham',
          state: 'CA',
          postalCode: '20202',
          country: 'USA',
        },
        medicalHistory: 'Allergic to peanuts',
      };

      

      const response = await request(app)
        .put('/profile/update-patient')
        .set('Cookie', `jwt=${patientToken}`)
        .set('Content-Type', 'multipart/form-data')
        .field('age', updatedProfile.age)
        .field('gender', updatedProfile.gender)
        .field('contactNumber', updatedProfile.contactNumber)
        .field('emergencyContact', updatedProfile.emergencyContact)
        .field('address[street]', updatedProfile.address.street)
        .field('address[city]', updatedProfile.address.city)
        .field('address[state]', updatedProfile.address.state)
        .field('address[postalCode]', updatedProfile.address.postalCode)
        .field('address[country]', updatedProfile.address.country)
        .field('medicalHistory', updatedProfile.medicalHistory)
        .attach('image', fs.readFileSync('./Utilites/uploads/image.jpeg'),'image.jpeg');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Patient profile Updated successfully');

      const updatedPatientProfile = await PatientProfile.findOne({ userID: patientUser._id });
      expect(updatedPatientProfile).not.toBeNull();
      expect(updatedPatientProfile.age).toBe(updatedProfile.age);
      expect(updatedPatientProfile.gender).toBe(updatedProfile.gender);
      expect(updatedPatientProfile.contactNumber).toBe(updatedProfile.contactNumber);
      expect(updatedPatientProfile.image).toBe('https://mockcloudinary.com/new-image.jpg');
    });
  });
});
