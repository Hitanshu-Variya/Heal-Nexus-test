import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import User from '../../data/models/user.model.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import LabTechnicianProfile from '../../data/models/profile/profile.labTechnician.js';


let mongoServer;
let technicianToken;
let technicianUser;
let technicianProfile;

const originalCloudinaryUpload = cloudinary.uploader.upload;

describe('Update Lab Technician Profile', () => {
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

  afterEach(() => {
    // Restore the original Cloudinary upload method after each test
    cloudinary.uploader.upload = originalCloudinaryUpload;
  });

  describe('PUT /profile/update-lab-technician', () => {
    it('should successfully update the lab technician profile', async () => {
      // Manually stub the Cloudinary upload method to return a mocked image URL
      cloudinary.uploader.upload = (imagePath, options) => {
        return new Promise((resolve) => {
          resolve({
            secure_url: 'https://mockcloudinary.com/new-lab-technician-image.jpg',
          });
        });
      };

      const updatedProfile = {
        userID: technicianUser._id,
        qualifications: 'MSc in Medical Technology',
        associatedLab: 'Advanced Health Labs',
        specialization: 'Microbiology',
        contactNumber: '9876543210',
        address: {
          street: '456 Advanced Lab Street',
          city: 'Metropolis',
          state: 'NY',
          postalCode: '65432',
          country: 'USA',
        },
        certifications: ['Certified Medical Technologist', 'Microbiology Certification'],
        yearsOfExperience: 10,
        image: 'https://mockcloudinary.com/new-lab-technician-image.jpg',
      };

      const response = await request(app)
        .put(`/profile/update-lab-technician/${technicianProfile._id}`)
        .set('Cookie', `jwt=${technicianToken}`)
        .set('Content-Type', 'multipart/form-data')
        .field('qualifications', updatedProfile.qualifications)
        .field('associatedLab', updatedProfile.associatedLab)
        .field('specialization', updatedProfile.specialization)
        .field('contactNumber', updatedProfile.contactNumber)
        .field('address[street]', updatedProfile.address.street)
        .field('address[city]', updatedProfile.address.city)
        .field('address[state]', updatedProfile.address.state)
        .field('address[postalCode]', updatedProfile.address.postalCode)
        .field('address[country]', updatedProfile.address.country)
        .field('certifications[]', updatedProfile.certifications[0])
        .field('certifications[]', updatedProfile.certifications[1])
        .field('yearsOfExperience', updatedProfile.yearsOfExperience)
        .attach('image', fs.readFileSync('./Utilites/uploads/img.png'), 'img.png');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Lab-Technician profile Updated successfully');
    });
  });
});
