// tests/diary.test.js
const request = require('supertest');
const app = require('../app');

// Mock OpenAI
jest.mock('../services/openai', () => ({
  analyzeEmotion: jest.fn(() => ({
    keywords: ['sun', 'happy', 'joy'],
    emotion: 'Joy'
  }))
}));

// Mock DB
jest.mock('../models/db', () => {
  const mockDB = {
    run: jest.fn(),
    all: jest.fn(() => Promise.resolve([
      {
        diaryId: 1,
        emotion: 'Joy',
        keyword1: 'sun',
        keyword2: 'happy',
        keyword3: 'joy',
        date: '2025-06-07'
      }
    ])),
    close: jest.fn()
  };

  return {
    getDBConnection: jest.fn(() => Promise.resolve(mockDB))
  };
});

describe('Diary API Test Suite', () => {
  describe('POST /api/diary', () => {
    it('should return 400 if missing fields', async () => {
      const res = await request(app).post('/api/diary').send({
        userId: 1,
        content: 'Today was great!'
        // no date
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should save diary and return 201', async () => {
      const res = await request(app).post('/api/diary').send({
        userId: 1,
        date: '2025-06-07',
        content: 'Today was amazing and I feel happy'
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.emotion).toBe('Joy');
      expect(res.body.keywords).toEqual(['sun', 'happy', 'joy']);
    });
  });

  describe('GET /api/diary', () => {
    it('should return 400 if userId is missing', async () => {
      const res = await request(app).get('/api/diary');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should return list of diaries for userId', async () => {
      const res = await request(app).get('/api/diary?userId=1');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('emotion', 'Joy');
    });
  });
});
