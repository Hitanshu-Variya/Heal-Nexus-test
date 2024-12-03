import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import bcrypt from 'bcryptjs';
import User from '../../data/models/user.model.js';
import nodemailer from 'nodemailer';



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
    role: 'Patient',
  };

  // Create the user and save to DB
  const user = new User(userData);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  user.password = hashedPassword;
  await user.save();
});

afterAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Reset Password', () => {
  const resetPasswordURL = '/auth/reset-password';

  let resetToken;

  beforeAll(async () => {
    // Generate a reset token and set the expiration date
    const user = await User.findOne({ email: userData.email });
    resetToken = 'validresetToken'; // Use your token generation logic here
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour validity
    await user.save();
  });

  describe('Reset Password Flow', () => {
    it('should successfully reset password with valid reset token', async () => {
      const response = await request(app)
        .post(`${resetPasswordURL}/${resetToken}`)
        .send({ password: 'NewPassword123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Success: password reset successfull!');
    //   expect(sendMailMock).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       to: userData.email,
    //       subject: expect.stringContaining('Success: password reset successfull!'),
    //     })
    //   );

      const updatedUser = await User.findOne({ email: userData.email });
      expect(await bcrypt.compare('NewPassword123', updatedUser.password)).toBe(true);
      expect(updatedUser.resetPasswordToken).toBeUndefined();
      expect(updatedUser.resetPasswordExpiresAt).toBeUndefined();
    });

    it('should return an error if reset token is invalid or expired', async () => {
      const response = await request(app)
        .post(`${resetPasswordURL}/invalidresetToken`)
        .send({ password: 'NewPassword123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request: Invalid or Expired Reset Token');
    //   expect(sendMailMock).not.toHaveBeenCalled();
    });

    it('should return an error if no password is provided', async () => {
      const response = await request(app)
        .post(`${resetPasswordURL}/${resetToken}`)
        .send({}); // No password provided

      expect(response.status).toBe(400); // Adjust status code based on your validation logic
      expect(response.body).toHaveProperty('message', 'Bad Request: Invalid or Expired Reset Token');
    });

    it('should return an error if the token has expired', async () => {
      const user = await User.findOne({ email: userData.email });
      user.resetPasswordExpiresAt = Date.now(); // Expired token (1 hour ago)
      await user.save();

      const response = await request(app)
        .post(`${resetPasswordURL}/${resetToken}`)
        .send({ password: 'NewPassword123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request: Invalid or Expired Reset Token');
    //   expect(sendMailMock).not.toHaveBeenCalled();
    });

    it('should return an error if user has already reset password', async () => {
      const user = await User.findOne({ email: userData.email });
      if (!user) {
        throw new Error("User not found.");
      }
      user.resetPasswordToken = null;  // Token cleared after reset
      user.resetPasswordExpiresAt = null;  // Expiration cleared after reset
      await user.save();

      const response = await request(app)
        .post(`${resetPasswordURL}/${resetToken}`)
        .send({ password: 'NewPassword123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request: Invalid or Expired Reset Token');
    });
  });
});
