import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import User from '../../data/models/user.model.js'; // Adjust the path to your user model
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
let mongoServer;
let pharmacistToken;
let pharmacistUser;

describe('Pharmacist Profile Routes', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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

    // Generate pharmacist JWT token
    pharmacistToken = jwt.sign({ userID: pharmacistUser._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should create a Pharmacist profile', async () => {
     // Manually stub the Cloudinary upload method to return a mocked image URL
     cloudinary.uploader.upload = (imagePath, options) => {
        return new Promise((resolve) => {
          resolve({
            secure_url: 'https://mockcloudinary.com/doctor-image.jpg',
          });
        });
      };
    const response = await request(app)
      .post('/profile/create-pharmacist')
      .set('Cookie', `jwt=${pharmacistToken}`)
      .field('certification', 'PhD in Pharmacy')
      .field('pharmacyName', 'PharmaTech')
      .field('pharmacyLocation[street]', '456 Elm St')
      .field('pharmacyLocation[city]', 'Gotham')
      .field('pharmacyLocation[state]', 'NY')
      .field('pharmacyLocation[postalCode]', '54321')
      .field('pharmacyLocation[country]', 'USA')
      .field('contactNumber', '1234567890')
      .field('yearsOfExperience', 10)
      .attach('image', fs.readFileSync('./Utilites/uploads/pharm.png'),'pharm.png');
    
    console.log("Response body:", response.body);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Pharmacist profile Created successfully');
  });
});
