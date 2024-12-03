import request from 'supertest';
import { userRole } from '../../Utilites/options.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../src/app.js';

let mongoServer;
let userData;

beforeAll(async () => {
  if (!process.env.SECRET_JWT_KEY) {
    process.env.SECRET_JWT_KEY = 'test-jwt-secret';
  }
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  userData = {
    userName: 'JohnDoe',
    email: 'johndoe@example.com',
    password: 'Password123',
    confirmPassword: 'Password123',
    role: userRole.PATIENT,
  };

  await request(app).post('/auth/signup').send(userData);
});

afterAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    try {
      await collections[key].deleteMany({});
    } catch (err) {
      console.error(`Error clearing collection ${key}:`, err);
    }
  }
});

describe('Email Verification', () => {
  const verifyEmailURL = '/auth/verify-email';  

  describe('Verify Email', () => {
    let verificationCode;
    let user;

    beforeAll(async () => {
      user = await mongoose.model('User').findOne({ email: userData.email });
      verificationCode = user.verificationCode;
    });

    it('should successfully verify email with valid verification code', async () => {
      const response = await request(app)
        .post(verifyEmailURL)
        .send({ ReceivedCode: verificationCode });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message','Email Verified Successfully');
      expect(response.body).toHaveProperty('role', 'Patient');
      expect(response.body).toHaveProperty('sucesss', true);
    });

    it('should return an error for invalid verification code', async () => {
      const response = await request(app)
        .post(verifyEmailURL)
        .send({ ReceivedCode: 'InvalidCode123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request: Invalid or Expired verification code');
    });

    it('should return an error for expired verification code', async () => {
      user.verificationCodeExpiresAt = Date.now() - 1000; 

      const response = await request(app)
        .post(verifyEmailURL)
        .send({ ReceivedCode: verificationCode });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request: Invalid or Expired verification code');
    });

    it('should return an error when verification code is missing', async () => {
      const response = await request(app).post(verifyEmailURL).send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request: Invalid or Expired verification code');
    });

    it('should return an error if user is already verified', async () => {
        user = await mongoose.model('User').findOne({ email: userData.email });
        user.isVerified = true;
        await user.save();
      
      const response = await request(app)
        .post(verifyEmailURL)
        .send({ ReceivedCode: verificationCode });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request: Invalid or Expired verification code');
    });
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
