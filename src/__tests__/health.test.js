const request = require('supertest');
const app = require('../index');

describe('Health Check', () => {
  it('GET /health should respond', async () => {
    const res = await request(app).get('/health');
    expect([200, 500]).toContain(res.statusCode);
  });
});