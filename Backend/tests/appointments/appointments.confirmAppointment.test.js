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
let appointment;

describe('Confirm Appointment', () => {
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
      userName: 'Test Patient',
      email: 'patient@test.com',
      password: 'password123',
      role: 'Patient',
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
      userName: 'Dr. Test Doctor',
      email: 'doctor@test.com',
      password: 'password123',
      role: 'Doctor',
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
      slot_booked: {
        '2024-12-01': [
          { slotTime: '10:00 AM', patientID: null, appointmentID: null },
        ],
      },
      consultationFee: 100,
    });

    // Create an appointment
    appointment = await Appointment.create({
      patientID: patientProfile._id,
      doctorID: doctorProfile._id,
      slotDate: '2024-12-01',
      slotTime: '10:00 AM',
      amount: 100,
      cancel: false,
      payment: false,
      date: Date.now(),
    });

    // Generate doctor JWT token
    doctorToken = jwt.sign({ userID: doctor._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('PUT /appointment/confirm-appointment/:appointmentID', () => {
    it('should successfully confirm an appointment', async () => {
      const response = await request(app)
        .put(`/appointment/pay-book-appointment/${appointment._id}`)
        .set('Cookie', `jwt=${patientToken}`);

      expect(response.status).toBe(200);
      
    });

})
});
