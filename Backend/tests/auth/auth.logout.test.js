import request from 'supertest';
import app from '../../src/app.js'; // Adjust the path to your app

describe('Logout', () => {
  it('should successfully log out the user', async () => {
    const response = await request(app)
      .post('/auth/logout') // Replace with your actual logout route if different
      .set('Cookie', 'jwt=some-valid-token'); // Simulate a valid JWT cookie

    expect(response.status).toBe(200);
    
    expect(response.body).toHaveProperty('message', 'Success: Logged Out Successfully!');
    
    expect(response.headers['set-cookie']).toBeDefined();
  });
});
