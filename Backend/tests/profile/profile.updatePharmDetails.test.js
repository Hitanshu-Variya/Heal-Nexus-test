import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import User from '../../data/models/user.model.js';
import PharmacistProfile from '../../data/models/profile/profile.pharmacist.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

let mongoServer;
let pharmacistToken;
let pharmacistUser;
let pharmacistProfile;

const originalCloudinaryUpload = cloudinary.uploader.upload;

describe('Update Pharmacist Profile', () => {
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
      pharmacyName: 'Old Pharmacy',
      pharmacyLocation: {
        street: '123 Test St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62704',
        country: 'USA',
      },
      contactNumber: '9876543210',
      yearsOfExperience: 5,
      image: 'https://mockcloudinary.com/old-image.jpg',
    });

    // Generate pharmacist JWT token
    pharmacistToken = jwt.sign({ userID: pharmacistUser._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(() => {
    // Restore the original Cloudinary upload method after each test
    cloudinary.uploader.upload = originalCloudinaryUpload;
  });

  describe('PUT /profile/update-pharmacist', () => {
    it('should successfully update the pharmacist profile', async () => {
      // Manually stub the Cloudinary upload method to return a mocked image URL
      cloudinary.uploader.upload = (imagePath, options) => {
        return new Promise((resolve) => {
          resolve({
            secure_url: 'https://mockcloudinary.com/new-image.jpg',
          });
        });
      };
  
      const updatedProfile = {
        certification: 'Updated Pharm.D',
        pharmacyName: 'Updated Pharmacy',
        pharmacyLocation: {
          street: '456 New St',
          city: 'Metropolis',
          state: 'CA',
          postalCode: '10101',
          country: 'USA',
        },
        contactNumber: '1122334455',
        yearsOfExperience: 8,
      };
  
      // Decode the token to extract the userID
      const decodedToken = jwt.verify(pharmacistToken, process.env.SECRET_JWT_KEY);
  
      const response = await request(app)
        .put(`/profile/update-pharmacist/${decodedToken.userID}`) // Pass the decoded userID
        .set('Cookie', `jwt=${pharmacistToken}`)
        .set('Content-Type', 'multipart/form-data')
        .field('certification', updatedProfile.certification)
        .field('pharmacyName', updatedProfile.pharmacyName)
        .field('pharmacyLocation[street]', updatedProfile.pharmacyLocation.street)
        .field('pharmacyLocation[city]', updatedProfile.pharmacyLocation.city)
        .field('pharmacyLocation[state]', updatedProfile.pharmacyLocation.state)
        .field('pharmacyLocation[postalCode]', updatedProfile.pharmacyLocation.postalCode)
        .field('pharmacyLocation[country]', updatedProfile.pharmacyLocation.country)
        .field('contactNumber', updatedProfile.contactNumber)
        .field('yearsOfExperience', updatedProfile.yearsOfExperience)
        .attach('image', fs.readFileSync('./Utilites/uploads/image1.jpeg'), 'image1.jpeg');
  
      expect(response.status).toBe(200);
    });
  });
  




})