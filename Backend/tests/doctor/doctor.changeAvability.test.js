import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js'; // Ensure this points to the correct app file
import User from '../../data/models/user.model.js'; // Ensure this points to the correct User model
import DoctorProfile from '../../data/models/profile/profile.doctor.js'; // Ensure this points to your doctor profile model

let mongoServer;
let doctorToken; // Token for doctor authorization

describe('Doctor Controller Tests', () => {
  beforeAll(async () => {
    if (!process.env.SECRET_JWT_KEY) {
      process.env.SECRET_JWT_KEY = 'test-jwt-secret';
    }

    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Create a doctor user and generate a token
    const doctorUser = await User.create({
      userName: 'Doctor User',
      email: 'doctor@doctor.com',
      password: 'password123',
      role: 'Doctor',
    });

    doctorToken = jwt.sign({ id: doctorUser._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });

    // Create doctor profile
    await DoctorProfile.create({
      userID: doctorUser._id,
      specialty: 'Cardiology',
      qualifications: ['MBBS', 'MD'],
      experience: 10,
      contactNumber: '1234567890',
      clinicAddress: { street: '456 Elm St', city: 'Gotham', state: 'NY', postalCode: '10002', country: 'USA' },
      image: 'doctor.jpg',
      available: true,
      isVerified: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

//   afterEach(async () => {
//     const collections = mongoose.connection.collections;
//     for (const key in collections) {
//       try {
//         await collections[key].deleteMany({});
//       } catch (err) {
//         console.error(`Error clearing collection ${key}:`, err);
//       }
//     }
//   });

  describe('POST /doctor/change-availability', () => {
    it('should change the doctor\'s availability status', async () => {
      const doctorProfile = await DoctorProfile.findOne({});

      // Send POST request to change availability
      const response = await request(app)
        .post('/patient/change-availability')
        .set('Cookie', `jwt=${doctorToken}`)
        .send({ userID: doctorProfile._id });

      // Validate the response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Availability changed successfully');

      // Validate that the availability has been toggled
      const updatedDocData = await DoctorProfile.findById(doctorProfile._id);
      expect(updatedDocData.available).toBe(!doctorProfile.available); // Availability should be toggled
    });

    it('should return 404 if doctor is not found', async () => {
      const invalidDoctorID = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post('/patient/change-availability')
        .set('Cookie', `jwt=${doctorToken}`)
        .send({ userID: invalidDoctorID });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Doctor not found');
    });

    
  });
});
