import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js'; // Ensure this points to the correct app file
import User from '../../data/models/user.model.js'; // Ensure this points to the correct User model

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

describe('Get User Details', () => {
  let user;
  let token;
  beforeEach(async () => {
    // Create a test user
    user = new User({
      userName: 'JohnDoe',
      email: 'johndoe@example.com',
      password: 'Password123',
      role: 'Patient',
    });
    await user.save();
      // Verify the user exists
    token = jwt.sign({userID: user._id}, process.env.SECRET_JWT_KEY, {expiresIn: "10d"});
  });

  const getUserDetailsURL = '/auth/get-user-details';

  it('should return user details for a valid userID', async () => {
    const response = await request(app)
      .get(getUserDetailsURL)
      .set('Cookie', `jwt=${token}`);

    // Debugging logs
    console.log('Response:', response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userName', user.userName);
    expect(response.body).toHaveProperty('email', user.email);
    expect(response.body).toHaveProperty('role', user.role);
  });

  it('should return an error if userID is missing in the request', async () => {
    const invalidToken = jwt.sign({}, process.env.SECRET_JWT_KEY, { expiresIn: '1h' });

    const response = await request(app)
      .get(getUserDetailsURL)
      .set('Authorization', `Bearer ${invalidToken}`);

    // Debugging logs
    console.log('Response:', response.body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Unauthorized - No token Provided!');
  });

  it('should return an error if user does not exist', async () => {
    const invalidUserIDToken = jwt.sign({ userID: new mongoose.Types.ObjectId().toString() }, process.env.SECRET_JWT_KEY, { expiresIn: '1h' });

    const response = await request(app)
      .get(getUserDetailsURL)
      .set('Cookie', `jwt=${invalidUserIDToken}`);;

    // Debugging logs
    console.log('Response:', response.body);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Resource not found: User not found');
  });
});
