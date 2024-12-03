import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app'; // Adjust the path to your app.js or server.js
import DoctorProfile from '../../data/models/profile/profile.doctor.js';

let mongoServer;

describe('Dashboard Filters', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Insert sample doctors into the database
    await DoctorProfile.create([
      {
        userID: new mongoose.Types.ObjectId(),
        specialty: 'Cardiology',
        qualifications: ['MBBS', 'MD'],
        experience: 10,
        contactNumber: '1234567890',
        clinicAddress: {
          street: '123 Maple St',
          city: 'Metropolis',
          state: 'NY',
          postalCode: '10101',
          country: 'USA',
        },
        consultationFee: 150,
        available: true,
        slot_booked: {},
        image: 'doctor1.jpg',
        isVerified: true,
      },
      {
        userID: new mongoose.Types.ObjectId(),
        specialty: 'Dermatology',
        qualifications: ['MBBS'],
        experience: 5,
        contactNumber: '9876543210',
        clinicAddress: {
          street: '456 Elm St',
          city: 'Gotham',
          state: 'NY',
          postalCode: '20201',
          country: 'USA',
        },
        consultationFee: 120,
        available: true,
        slot_booked: {},
        image: 'doctor2.jpg',
        isVerified: true,
      },
    ]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  
  describe('GET /search-by-city', () => {
    it('should return doctors for a valid city', async () => {
      const response = await request(app)
        .get('/search-by-city')
        .send({ city: 'Metropolis' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1); // 1 doctor in Metropolis
      expect(response.body[0].clinicAddress.city).toBe('Metropolis');
    });

    it('should return 400 if city parameter is missing', async () => {
      const response = await request(app)
        .get('/search-by-city')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('City parameter is required');
    });

    it('should return 404 for a city with no doctors', async () => {
      const response = await request(app)
        .get('/search-by-city')
        .send({ city: 'Central City' }); // No doctors in Central City

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No doctors found in the specified city');
    });

    
  });
});