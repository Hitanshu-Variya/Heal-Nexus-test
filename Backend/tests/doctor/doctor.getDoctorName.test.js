import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js'; // Ensure this points to the correct app file
import User from '../../data/models/user.model.js'; // Ensure this points to the correct User model
import DoctorProfile from '../../data/models/profile/profile.doctor.js'; // Ensure this points to your doctor profile model

let mongoServer;

beforeAll(async () => {
  if (!process.env.SECRET_JWT_KEY) {
    process.env.SECRET_JWT_KEY = 'test-jwt-secret';
  }
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
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

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Get Doctor Details', () => {
  let doctor;
  let doctorProfile;
  let token;

  beforeEach(async () => {
    // Create a test doctor user
    doctor = new User({
      userName: 'Dr. John Doe',
      email: 'drjohndoe@example.com',
      password: 'Password123',
      role: 'Doctor',
    });
    await doctor.save();

    // Create a profile for the doctor
    doctorProfile = new DoctorProfile({
      userID: doctor._id,
      specialty: 'Cardiology',
      qualifications: ['MBBS', 'MD'],
      experience: 15,
      contactNumber: '1234567890',
      clinicAddress: { street: '123 Main St', city: 'Gotham', state: 'NY', postalCode: '10001', country: 'USA' },
      available: true,
      isVerified: true,
    });
    await doctorProfile.save();

    // Generate a token for the doctor
    token = jwt.sign({ userID: doctor._id }, process.env.SECRET_JWT_KEY, { expiresIn: "10d" });
  });

  const getDoctorDetailsURL = '/patient/get-doctor-name';

  it('should return doctor details for a valid doctorID', async () => {
    const response = await request(app)
      .get(getDoctorDetailsURL)
      .set('Cookie', `jwt=${token}`);

    // Debugging logs
    console.log('Response:', response.body);

    expect(response.status).toBe(200);
  
  });

  it('should return an error if doctorID is missing in the request', async () => {
    const invalidToken = jwt.sign({}, process.env.SECRET_JWT_KEY, { expiresIn: '1h' });

    const response = await request(app)
      .get(getDoctorDetailsURL)
      .set('Authorization', `Bearer ${invalidToken}`);

    // Debugging logs
    console.log('Response:', response.body);

    expect(response.status).toBe(400);
    
  });

  it('should return an error if doctor does not exist', async () => {
    const invalidDoctorIDToken = jwt.sign({ userID: new mongoose.Types.ObjectId().toString() }, process.env.SECRET_JWT_KEY, { expiresIn: '1h' });

    const response = await request(app)
      .get(getDoctorDetailsURL)
      .set('Cookie', `jwt=${invalidDoctorIDToken}`);

    // Debugging logs
    console.log('Response:', response.body);

    expect(response.status).toBe(404);
    
  });
});
