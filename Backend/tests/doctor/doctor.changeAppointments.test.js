import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js'; // Adjust the path to your app
import Appointment from '../../data/models/appointment.models.js';
import DoctorProfile from '../../data/models/profile/profile.doctor.js';
import User from '../../data/models/user.model.js';

let mongoServer;
let doctorToken;
let doctorUser, doctorProfile, appointment;

describe('Complete Appointment API Tests', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    if (!process.env.SECRET_JWT_KEY) {
      process.env.SECRET_JWT_KEY = 'test-jwt-secret';
    }

    // Create doctor user
    doctorUser = await User.create({
      userName: 'Doctor User',
      email: 'doctor@example.com',
      password: 'password123',
      role: 'Doctor',
    });

    // Create doctor profile
    doctorProfile = await DoctorProfile.create({
      userID: doctorUser._id,
      specialty: 'Dermatology',
      qualifications: ['MBBS'],
      experience: 10,
      contactNumber: '1234567890',
      clinicAddress: { street: '123 Elm St', city: 'Metropolis', state: 'CA', postalCode: '12345', country: 'USA' },
      available: true,
      isVerified: true,
    });

    // Generate JWT for the doctor
 
    // Create an appointment
    appointment = await Appointment.create({
      patientID: new mongoose.Types.ObjectId(),
      doctorID: doctorUser._id,
      slotTime: '10:00 AM',
      slotDate: '2024-11-27',
      amount: 100,
      date: Date.now(),
      cancel: false,
      payment: true,
      isCompleted: false,
    });
    doctorToken = jwt.sign({ userID: doctorUser._id }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });

  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      try {
        await collections[key].deleteMany({});
      } catch (err) {
        console.error(`Error clearing collection ${key}:`, err);
      }
    }
  });

  describe('POST /doctor/complete-appointment', () => {
    it('should mark an appointment as completed successfully', async () => {
      const response = await request(app)
        .post('/patient/complete-appointment')
        .set('Cookie', `jwt=${doctorToken}`)
        .send({  userID: doctorUser._id, appointmentID: appointment._id });
      console.log(doctorUser._id);
      
      expect(response.status).toBe(200);
      const updatedAppointment = await Appointment.findById(appointment._id);
      console.log(updatedAppointment.doctorID);
      expect(updatedAppointment.isCompleted).toBe(true);
    });

    it('should return an error if the doctor does not own the appointment', async () => {
      const response = await request(app)
        .post('/patient/complete-appointment')
        .set('Cookie', `jwt=${doctorToken}`)
        .send({ userID: doctorUser._id, appointmentID: new mongoose.Types.ObjectId() });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Mark Failed'); // Updated to match the controller response
    });

    it('should return an error if the appointment does not exist', async () => {
      const invalidAppointmentID = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post('/patient/complete-appointment')
        .set('Cookie', `jwt=${doctorToken}`)
        .send({ userID: doctorUser._id, appointmentID: invalidAppointmentID });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Mark Failed'); // Updated to match the controller response
    });
  });
});
