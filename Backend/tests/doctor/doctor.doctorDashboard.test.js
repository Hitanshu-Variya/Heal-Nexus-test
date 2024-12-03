import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js';  // Adjust the path if needed
import Appointment from '../../data/models/appointment.models.js';
import User from '../../data/models/user.model.js';
import DoctorProfile from '../../data/models/profile/profile.doctor.js';

let mongoServer;
let doctorToken;
let doctorUser, doctorProfile, appointments;

describe('Doctor Dashboard API Tests', () => {
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
    doctorToken = jwt.sign(
      { userID: doctorUser._id }, 
      process.env.SECRET_JWT_KEY, 
      { expiresIn: '1d' }
    );

    // Create mock unique patients
    const patientId1 = new mongoose.Types.ObjectId();
    const patientId2 = new mongoose.Types.ObjectId();
    const patientId3 = new mongoose.Types.ObjectId();

    // Create mock appointments for the doctor
    appointments = await Appointment.create([
      {
        patientID: patientId1,
        doctorID: doctorProfile._id,
        slotTime: '10:00 AM',
        slotDate: '2024-11-27',
        amount: 100,
        date: Date.now(),
        cancel: false,
        payment: true,
        isCompleted: true,
      },
      {
        patientID: patientId2,
        doctorID: doctorProfile._id,
        slotTime: '11:00 AM',
        slotDate: '2024-11-27',
        amount: 200,
        date: Date.now(),
        cancel: false,
        payment: false,
        isCompleted: false,
      },
      {
        patientID: patientId3,
        doctorID: doctorProfile._id,
        slotTime: '12:00 PM',
        slotDate: '2024-11-27',
        amount: 150,
        date: Date.now(),
        cancel: false,
        payment: true,
        isCompleted: false,
      },
    ]);
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

  describe('GET /doctor/dashboard', () => {
    it('should fetch doctor dashboard with correct data', async () => {
      // Prepare request body with userID
      const requestBody = {
        userID: doctorProfile._id
      };

      const response = await request(app)
        .get('/patient/dashboard')
        .send(requestBody)
        .set('Cookie', `jwt=${doctorToken}`); // Assuming the token is set in a cookie

      // Log the response for debugging
      console.log('Doctor Dashboard Data:', response.body);

      // Check if response has the expected structure
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      const { doctorDashboardData } = response.body;
      
      // Earnings should be 250 (100 from first completed paid appointment + 150 from second paid appointment)
      expect(doctorDashboardData.earings).toBe(250); 
      
      // Total appointments created
      expect(doctorDashboardData.appointments).toBe(3); 
      
      // Three unique patients
      expect(doctorDashboardData.patient).toBe(3); 
      
      // Latest appointments should match total appointments
      expect(doctorDashboardData.latestappointments.length).toBe(3);
    });

    it('should handle when no appointments are found', async () => {
      // Create a doctor with no appointments
      const doctorNoAppointments = await User.create({
        userName: 'Doctor No Appointments',
        email: 'doctor_no_appointments@example.com',
        password: 'password123',
        role: 'Doctor',
      });

      const doctorProfileNoAppointments = await DoctorProfile.create({
        userID: doctorNoAppointments._id,
        specialty: 'Cardiology',
        qualifications: ['MD'],
        experience: 15,
        contactNumber: '9876543210',
        clinicAddress: { 
          street: '456 Oak St', 
          city: 'Metropolis', 
          state: 'CA', 
          postalCode: '12345', 
          country: 'USA' 
        },
        available: true,
        isVerified: true,
      });

      const doctorTokenNoAppointments = jwt.sign(
        { userID: doctorNoAppointments._id }, 
        process.env.SECRET_JWT_KEY, 
        { expiresIn: '1d' }
      );

      // Prepare request body with userID for doctor with no appointments
      const requestBody = {
        userID: doctorNoAppointments._id
      };

      const response = await request(app)
        .get('/patient/dashboard')
        .send(requestBody)
        .set('Cookie', `jwt=${doctorTokenNoAppointments}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.doctorDashboardData.earings).toBe(0);
      expect(response.body.doctorDashboardData.appointments).toBe(0);
      expect(response.body.doctorDashboardData.patient).toBe(0);
      expect(response.body.doctorDashboardData.latestappointments.length).toBe(0);
    });
  });
});