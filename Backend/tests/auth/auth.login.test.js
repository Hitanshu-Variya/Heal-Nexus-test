import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app.js';
import bcrypt from 'bcryptjs';
import User from '../../data/models/user.model.js';
import Profile from '../../data/models/profile/profile.admin.js'; // Add this import

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
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Login', () => {
  const loginURL = '/auth/login';

  let user;
  let hashedPassword;

  beforeEach(async () => {
    // Create a new user for each test
    const userData = {
      userName: 'JohnDoe',
      email: 'johndoe@example.com',
      password: 'Password123',
      role: 'Patient',
    };

    hashedPassword = await bcrypt.hash(userData.password, 10);
    user = new User({
      ...userData,
      password: hashedPassword,
    });
    await user.save();

    const profile = new Profile({
      userID: user._id,
      isVerified: true,
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'Anystate',
        country: 'USA',
        postalCode: '12345',
      },
    });
    await profile.save();
  });
it('should successfully login as admin with correct credentials', async () => {
  const response = await request(app)
    .post(loginURL)
    .send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('role', 'Admin');
  expect(response.body).toHaveProperty('role','Admin');  // Fix this line
});


  
  it('should return an error for invalid email', async () => {
    const response = await request(app)
      .post(loginURL)
      .send({
        email: 'invalid@example.com',
        password: 'Password123',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'User Unauthorized: Invalid Credentials');
  });

  it('should return an error for invalid password', async () => {
    const response = await request(app)
      .post(loginURL)
      .send({
        email: 'johndoe@example.com',
        password: 'WrongPassword',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'User Unauthorized: Invalid Credentials');
  });
});
