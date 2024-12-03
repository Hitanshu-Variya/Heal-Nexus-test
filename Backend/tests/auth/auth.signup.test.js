import request from 'supertest'; 
import { userRole } from '../../Utilites/options.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../src/app.js'; 


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

describe('Authentication', () => {
  const signupURL = '/auth/signup';  
  describe('Signup', () => {
    it('should successfully register a user with valid details', async () => {
      const userData = {
        userName: 'JohnDoe',
        email: 'johndoe@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        role: userRole.PATIENT,
      };
  
      const response = await request(app).post(signupURL).send(userData);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should return an error for mismatched passwords', async () => {
      const userData = {
        userName: 'JohnDoe',
        email: 'johndoe@example.com',
        password: 'Password123',
        confirmPassword: 'Password456',
        role: userRole.PATIENT,
      };

      const response = await request(app).post(signupURL).send(userData);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request: Passwords do not match!');
    });

    it('should return an error for an invalid email', async () => {
      const userData = {
        userName: 'JohnDoe',
        email: 'invalid-email',
        password: 'Password123',
        confirmPassword: 'Password123',
        role: userRole.PATIENT,
      };

      const response = await request(app).post(signupURL).send(userData);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Internal Server Error: Error in Signup');
    });

    it('should return an error for a role not in the predefined roles', async () => {
      const userData = {
        userName: 'JohnDoe',
        email: 'johndoe@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        role: 'UnknownRole',
      };

      const response = await request(app).post(signupURL).send(userData);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request: Invalid User role!');
    });

    it('should return an error for missing fields', async () => {
      const userData = {
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
      };

      const response = await request(app).post(signupURL).send(userData);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request: All fields are necessary and cannot be empty!');
    });
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});