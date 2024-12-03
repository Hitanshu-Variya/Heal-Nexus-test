import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app.js';
import nodemailer from 'nodemailer';
import User from '../../data/models/user.model.js';



let mongoServer;

beforeAll(async () => {
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

describe('Forget Password', () => {
  const forgetPasswordURL = '/auth/forget-password';

  it('should send a password reset link if the email exists', async () => {
    const userData = {
      userName: 'JohnDoe',
      email: 'johndoe@example.com',
      password: 'Password123',
      role: 'Patient',
    };

    const user = new User(userData);
    await user.save();

    const response = await request(app).post(forgetPasswordURL).send({ email: user.email });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success: password reset link send successfully!');
    // expect(sendMailMock).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     to: user.email,
    //     subject: expect.stringContaining('Reset Password'),
    //   })
    

    const updatedUser = await User.findOne({ email: user.email });
    expect(updatedUser).toHaveProperty('resetPasswordToken');
    expect(updatedUser).toHaveProperty('resetPasswordExpiresAt');
  });

  it('should return an error if the email does not exist', async () => {
    const response = await request(app).post(forgetPasswordURL).send({ email: 'nonexistent@example.com' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Bad Request: Invalid E-mail address');
    // expect(sendMailMock).not.toHaveBeenCalled();
  });

  it('should return an error if no email is provided', async () => {
    const response = await request(app).post(forgetPasswordURL).send({});

    expect(response.status).toBe(400); // Adjust status code based on your validation logic
    expect(response.body).toHaveProperty('message', 'Bad Request: Invalid E-mail address');
    // expect(sendMailMock).not.toHaveBeenCalled();
  });

});
