import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../src/app.js'; // Adjust the path as needed
import AdminProfile from '../../data/models/profile/profile.admin.js';

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

describe('Update Admin Profile', () => {
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
      permissions: ['manageUsers'],
    });
    await admin.save();
  });

  const updateAdminProfileURL = '/admin/update-profile';

  it('should update admin profile successfully', async () => {
    const updatedData = {
      address: {
        street: '456 New St',
        city: 'NewCity',
        state: 'NewState',
        postalCode: '67890',
        country: 'NewCountry',
      },
      permissions: ['manageUsers', 'viewReports'],
    };

    const response = await request(app)
      .put(`${updateAdminProfileURL}/${admin._id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Admin profile Updated successfully');

    const updatedAdmin = await AdminProfile.findById(admin._id);
    expect(updatedAdmin.address.street).toBe(updatedData.address.street);
    expect(updatedAdmin.permissions).toEqual(updatedData.permissions);
  });

  it('should return an error if admin does not exist', async () => {
    const invalidAdminID = new mongoose.Types.ObjectId(); // Non-existing admin ID

    const response = await request(app)
      .put(`${updateAdminProfileURL}/${invalidAdminID}`)
      .send({
        address: {
          street: 'New Street',
          city: 'New City',
          state: 'New State',
          postalCode: '12345',
          country: 'New Country',
        },
        permissions: ['manageUsers'],
      });

    expect(response.status).toBe(404); 
  });
});
