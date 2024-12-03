import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken'; // For token generation
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import Appointment from '../../data/models/appointment.models.js'; // Adjust the path to your models
import DoctorProfile from '../../data/models/profile/profile.doctor.js'; // Adjust the path to your models
import PatientProfile from '../../data/models/profile/profile.patient.js'; // Adjust the path to your models

let mongoServer;
let adminToken; // Token for authorization

describe('Admin Appointments Route Tests', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    if (!process.env.SECRET_JWT_KEY) {
      process.env.SECRET_JWT_KEY = 'test-jwt-secret';
    }
    // Generate a valid token for testing
    adminToken = jwt.sign({ id: 'adminId123', role: 'admin' }, process.env.SECRET_JWT_KEY, { expiresIn: '1d' });
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

  test('GET /admin/appointments - should return all appointments', async () => {
    // Create test patient
    const patient = await PatientProfile.create({
      userName: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      address: {
        street: '123 Main St',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      },
      gender: 'Male',
      age: 30,
    });

    // Create test doctor with required fields
    const doctor = await DoctorProfile.create({
      userName: 'Dr. Jane Smith',
      specialty: 'Cardiology',
      experience: 10, // required field
      clinicAddress: {
        street: '456 Elm St',
        city: 'Gotham',
        state: 'NY',
        postalCode: '10002',
        country: 'USA',
      },
      image: 'doctor-image.jpg',
    });

    // Create test appointments
    await Appointment.create({
      patientID: patient._id,
      doctorID: doctor._id,
      slotTime: '10:00 AM',
      slotDate: '2024-11-30',
      amount: 100,
      date: Date.now(),
      cancel: false,
      payment: true,
      isCompleted: false,
    });

    await Appointment.create({
      patientID: patient._id,
      doctorID: doctor._id,
      slotTime: '2:00 PM',
      slotDate: '2024-12-01',
      amount: 150,
      date: Date.now(),
      cancel: true,
      payment: false,
      isCompleted: true,
    });

    // Send GET request with token
    const response = await request(app)
      .get('/admin/appointments')
      .set('Cookie', `jwt=${adminToken}`);

    // Validate response
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('appointments');
    expect(response.body.appointments).toHaveLength(2);

    // Validate structure of returned data
    response.body.appointments.forEach((appointment) => {
      expect(appointment).toHaveProperty('patientID');
      expect(appointment).toHaveProperty('doctorID');
      expect(appointment).toHaveProperty('slotTime');
      expect(appointment).toHaveProperty('slotDate');
      expect(appointment).toHaveProperty('amount');
      expect(appointment).toHaveProperty('cancel');
      expect(appointment).toHaveProperty('payment');
      expect(appointment).toHaveProperty('isCompleted');
    });
  });

  test('GET /admin/appointments - should return an empty list if no appointments', async () => {
    // Send GET request with token
    const response = await request(app)
      .get('/admin/appointments')
      .set('Cookie', `jwt=${adminToken}`);

    // Validate response
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.appointments).toHaveLength(0);
  });

});
