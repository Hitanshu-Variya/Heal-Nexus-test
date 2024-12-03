import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../src/app.js'; // Ensure this points to the correct app file
import jwt from 'jsonwebtoken';

let mongoServer;

beforeAll(async () => {
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



describe('Admin Login', () => {
  const loginURL = '/admin/signup'; // Adjust if your route is different

  // Mock environment variables for testing
  beforeEach(() => {
    process.env.ADMIN_EMAIL = 'admin@example.com';
    process.env.ADMIN_PASSWORD = 'securepassword';
    process.env.JWT_SECRET = 'supersecretkey';
  });

  it('should return a success response with a token for valid credentials', async () => {
    const validCredentials = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    };

    const response = await request(app)
      .post(loginURL)
      .send(validCredentials);

    // Debugging logs
    console.log('Response:', response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('token');
  });

  it('should return an error response for invalid credentials', async () => {
    const invalidCredentials = {
      email: 'wrong@example.com',
      password: 'wrongpassword',
    };

    const response = await request(app)
      .post(loginURL)
      .send(invalidCredentials);

    // Debugging logs
    console.log('Response:', response.body);

    expect(response.status).toBe(200); // Status is 200, but success should be false
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Invalid Email or Password');
  });

  it('should handle server errors gracefully', async () => {
    const originalEnv = { ...process.env }; // Backup original env
    delete process.env.JWT_SECRET; // Simulate missing JWT_SECRET to cause an error

    const validCredentials = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    };

    const response = await request(app)
      .post(loginURL)
      .send(validCredentials);

    // Debugging logs
    console.log('Response:', response.body);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Server error');

    process.env = originalEnv; // Restore original env
  });
});
