import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import DoctorProfile from '../../data/models/profile/profile.doctor.js';
import PatientProfile from '../../data/models/profile/profile.patient.js';
import Appointment from '../../data/models/appointment.models.js';
import User from '../../data/models/user.model.js';

let mongoServer;
let doctorToken;
let doctor;
let doctorProfile;

describe('Appointments Doctor Controller Tests', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    if (!process.env.SECRET_JWT_KEY) {
      process.env.SECRET_JWT_KEY = 'test-jwt-secret';
    }

    // Create a doctor user and profile
    doctor = await User.create({
      userName: 'Dr. Jane Doe',
      email: 'jane.doe@example.com',
      password: 'password123',
      role: 'Doctor',
    });

    doctorProfile = await DoctorProfile.create({
      userID: doctor._id,
      specialty: 'Dermatology',
      qualifications: ['MBBS', 'MD'],
      experience: 8,
      contactNumber: '1234567890',
      clinicAddress: {
        street: '789 Willow Lane',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10101',
        country: 'USA',
      },
      image: 'doctor.jpg',
      available: true,
      isVerified: true,
    });

    // Generate token
    doctorToken = jwt.sign({ userID: doctor._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

//   afterEach(async () => {
//     const collections = mongoose.connection.collections;
//     for (const key in collections) {
//       await collections[key].deleteMany({});
//     }
//   });

  describe('GET /appointments', () => {
    it('should return all appointments for a doctor, including completed and pending ones', async () => {
      // Create a patient
      const patient = await User.create({
        userName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

      const patientProfile = await PatientProfile.create({
        userID: patient._id,
        age: 30,
        gender: 'Male',
        image: 'patient.jpg',
        address: {
          street: '123 Maple St',
          city: 'Metropolis',
          state: 'NY',
          postalCode: '10101',
          country: 'USA',
        },
      });

      // Create pending and completed appointments
      await Appointment.create([
        {
          patientID: patientProfile._id,
          doctorID: doctorProfile._id,
          slotTime: '10:00 AM',
          slotDate: '2024-11-30',
          amount: 100,
          date: Date.now(),
          cancel: false,
          payment: false,
          isCompleted: false,
        },
        {
          patientID: patientProfile._id,
          doctorID: doctorProfile._id,
          slotTime: '11:00 AM',
          slotDate: '2024-11-29',
          amount: 200,
          date: Date.now(),
          cancel: false,
          payment: true,
          isCompleted: true,
        },
      ]);

      const response = await request(app)
        .get('/patient/appointments')
        .set('Cookie', `jwt=${doctorToken}`);

      expect(response.status).toBe(200);

    });

    it('should return a total amount for all completed appointments', async () => {

      const response = await request(app)
        .get('/patient/appointments')
        .set('Cookie', `jwt=${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.totalAmount).toBe(200);
    });
  });
});
