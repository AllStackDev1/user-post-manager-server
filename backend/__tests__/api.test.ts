import request from 'supertest';
import app from '../src/index';

describe('API Tests', () => {
  test('GET /users with pagination should return users with address', async () => {
    const response = await request(app).get('/users?pageNumber=0&pageSize=4');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('pageNumber', 0);
    expect(response.body).toHaveProperty('pageSize', 4);
    expect(response.body).toHaveProperty('totalPages');
    expect(Array.isArray(response.body.data)).toBe(true);
    if (response.body.data.length > 0) {
      expect(response.body.data[0]).toHaveProperty('address');
      expect(response.body.data[0].address).toHaveProperty('street');
    }
  });

  test('GET /users/count should return count', async () => {
    const response = await request(app).get('/users/count');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('count');
    expect(typeof response.body.count).toBe('number');
  });

  test('GET /posts?userId=invalid should return 404', async () => {
    const response = await request(app).get('/posts?userId=invalid');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Invalid userId');
  });

  test('POST /posts with valid data should create post', async () => {
    const newPost = { title: 'Test Title', body: 'Test Body', userId: 'ee10b0e8346a4a0d990668fd1155fbc2' }; // assume userId exists
    const response = await request(app).post('/posts').send(newPost);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Title');
  });

  test('POST /posts with missing fields should return 400', async () => {
    const response = await request(app).post('/posts').send({ title: 'Test' });
    expect(response.status).toBe(400);
  });

  test('DELETE /posts/:id with valid id should delete', async () => {
    // First create a post
    const newPost = { title: 'Test Title', body: 'Test Body', userId: 'ee10b0e8346a4a0d990668fd1155fbc2' };
    const createRes = await request(app).post('/posts').send(newPost);
    const postId = createRes.body.id;

    const response = await request(app).delete(`/posts/${postId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Post deleted successfully');

    // Try to delete again, should 404
    const response2 = await request(app).delete(`/posts/${postId}`);
    expect(response2.status).toBe(404);
  });
});
