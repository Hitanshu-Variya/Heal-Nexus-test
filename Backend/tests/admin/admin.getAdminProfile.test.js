import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../src/app.js'; // Ensure this points to the correct app file
import AdminProfile from '../../data/models/profile/profile.admin.js'; // Ensure this points to the correct AdminProfile model

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

describe('Get Admin Details', () => {
  let admin;

  beforeEach(async () => {
    // Create a test admin profile
    admin = new AdminProfile({
      address: {
        street: '123 Admin St',
        city: 'AdminCity',
        state: 'AdminState',
        postalCode: '12345',
        country: 'AdminCountry',
      },
      permissions: 'SuperAdmin',
    });
    await admin.save();
    console.log(admin);
  });

  const getAdminDetailsURL = '/admin/get-profile';

  it('should return admin details for a valid admin ID', async () => {
    const response = await request(app)
      .get(`${getAdminDetailsURL}/${admin._id}`); // Directly querying by admin's ID

    // Debugging logs
    console.log('Response:', response.body);

    expect(response.status).toBe(200);
  });

    it('should return an error if admin does not exist', async () => {
        const invalidAdminID = new mongoose.Types.ObjectId(); // A non-existing admin ID

        const response = await request(app)
        .get(`${getAdminDetailsURL}/${invalidAdminID}`); // Query with invalid admin ID

        // Debugging logs
        console.log('Response:', response.body);

        
    });
});
