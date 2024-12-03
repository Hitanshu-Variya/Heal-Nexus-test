import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import User from '../../data/models/user.model.js'; // Adjust the path to your user model
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

let mongoServer;
let labTechnicianToken;
let labTechnicianUser;

describe('Lab Technician Profile Routes', () => {
  beforeAll(async () => {
    // Start an in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Set the JWT secret if not already set
    if (!process.env.SECRET_JWT_KEY) {
      process.env.SECRET_JWT_KEY = 'test-jwt-secret';
    }

    // Create a lab technician user
    labTechnicianUser = await User.create({
      userName: 'Test Lab Technician',
      email: 'labtech@test.com',
      password: 'password123',
      role: 'Lab-Technician',
    });

    // Generate lab technician JWT token
    labTechnicianToken = jwt.sign({ userID: labTechnicianUser._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should create a Lab Technician profile', async () => {
    // Mock the Cloudinary upload method
    cloudinary.uploader.upload = (imagePath, options) => {
      return new Promise((resolve) => {
        resolve({
          secure_url: 'https://mockcloudinary.com/labtech-image.jpg',
        });
      });
    };

    // Perform the test
    const response = await request(app)
      .post('/profile/create-lab-technician')
      .set('Cookie', `jwt=${labTechnicianToken}`)
      .field('qualifications', 'BSc in Medical Technology')
    .field('associatedLab', 'Prime Health Labs')
    .field('specialization', 'Hematology')
    .field('contactNumber', '1234567890')
    .field('address[street]', '123 Lab Street')
    .field('address[city]', 'Metropolis')
    .field('address[state]', 'NY')
    .field('address[postalCode]', '54321')
    .field('address[country]', 'USA')
    .field('certifications[]', 'Certified Clinical Laboratory Technician')
    .field('certifications[]', 'Phlebotomy Certification')
    .field('yearsOfExperience', 7)
    .attach('image', fs.readFileSync('./Utilites/uploads/pharm.png'),'pharm.png');


    console.log('Response body:', response.body);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Lab-Technician profile Created successfully');
  });
});
