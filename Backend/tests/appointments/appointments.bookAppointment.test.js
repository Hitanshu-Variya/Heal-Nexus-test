import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import User from '../../data/models/user.model.js';
import DoctorProfile from '../../data/models/profile/profile.doctor.js';
import PatientProfile from '../../data/models/profile/profile.patient.js';
import Appointment from '../../data/models/appointment.models.js';

let mongoServer;
let patientToken;
let doctorToken;
let doctorProfile;
let patientProfile;
let doctor;
let patient;

describe('Book Appointment Route Tests', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Set a secret key for JWT if not already set
    if (!process.env.SECRET_JWT_KEY) {
      process.env.SECRET_JWT_KEY = 'test-jwt-secret';
    }

    // Create a patient user and profile
    patient = await User.create({
      userName: 'Test Patient',  // Added userName field
      email: 'patient@test.com',
      password: 'password123',
      role: 'Patient',  // Ensure 'patient' is a valid role in your User schema
    });
    patientProfile = await PatientProfile.create({
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

    // Generate patient JWT token
    patientToken = jwt.sign({ userID: patient._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });

    // Create a doctor user and profile
    doctor = await User.create({
      userName: 'Dr. Test Doctor',  // Added userName field
      email: 'doctor@test.com',
      password: 'password123',
      role: 'Doctor',  // Ensure 'doctor' is a valid role in your User schema
    });
    doctorProfile = await DoctorProfile.create({
      userID: doctor._id,
      specialty: 'General',
      qualifications: ['MBBS'],
      experience: 5,
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
      slot_booked: {},
      consultationFee: 100, // Make sure to set the consultation fee here
    });

    // Generate doctor JWT token
    doctorToken = jwt.sign({ userID: doctor._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('POST /appointment/book-appointment', () => {
    it('should successfully book an appointment', async () => {
      console.log('Patient Token:', patientToken);
      console.log('Doctor ID:', doctorProfile._id);

      const response = await request(app)
        .post('/appointment/book-appointment')
        .set('Cookie', `jwt=${patientToken}`)
        .send({
          userID: patient._id,
          doctorID: doctorProfile._id,
          slotDate: '2024-12-01',
          slotTime: '10:00 AM',
        });

      console.log('Response Body:', response.body); // This will help debug the response

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Appointment booked successfully');
    });

    it('should return 400 if patient or doctor not found', async () => {
      const invalidDoctorID = new mongoose.Types.ObjectId(); // Invalid ObjectId
      const response = await request(app)
        .post('/appointment/book-appointment')
        .set('Cookie', `jwt=${patientToken}`)
        .send({
          userID: patient._id,
          doctorID: invalidDoctorID,
          slotDate: '2024-12-01',
          slotTime: '10:00 AM',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Patient or Doctor not found');
    });

    it('should return 400 if doctor is not available at the requested time', async () => {
      // Simulate the doctor having the requested slot booked already
      doctorProfile.slot_booked['2024-12-01'] = ['10:00 AM'];
      await doctorProfile.save();

      const response = await request(app)
        .post('/appointment/book-appointment')
        .set('Cookie', `jwt=${patientToken}`)
        .send({
          userID: patient._id,
          doctorID: doctorProfile._id,
          slotDate: '2024-12-01',
          slotTime: '10:00 AM',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Doctor not available at this time');
    });

  });
});