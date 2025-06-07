// tests/auth.test.js
const request = require('supertest');
const app = require('../app');
const passport = require('passport');

jest.mock('../models/db', () => {
  let db = {
    get: jest.fn(),
    run: jest.fn(),
    close: jest.fn()
  };

  return {
    getDBConnection: jest.fn(() => Promise.resolve(db)),
    __mockDB: db  // 내부에서 설정 바꾸기 위해 export
  };
});

jest.spyOn(passport, 'authenticate').mockImplementation(() => {
    return (req, res, next) => {
      if (req.body.email === 'fail@example.com') {
        return res.status(401).send("Unauthorized");
      } else {
        req.logIn({ userId: 1 }, () => {
          return res.json({ userId: 1 });
        });
      }
    };
  });

const { __mockDB } = require('../models/db');

describe('Auth API Test Suite', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should fail if passwords do not match', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          name: 'Test',
          email: 'test@example.com',
          password: '1234',
          confirm: '5678',
          phoneNum: '01012345678',
          birthDate: '2000-01-01'
        });

      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Passwords do not match');
    });

    it('should fail if email already exists', async () => {
      __mockDB.get.mockResolvedValueOnce({ email: 'test@example.com' });

      const res = await request(app)
        .post('/register')
        .send({
          name: 'Test',
          email: 'test@example.com',
          password: '1234',
          confirm: '1234',
          phoneNum: '01012345678',
          birthDate: '2000-01-01'
        });

      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Email already registered');
    });

    it('should register successfully', async () => {
      __mockDB.get.mockResolvedValueOnce(null); // no user exists

      const res = await request(app)
        .post('/register')
        .send({
          name: 'Test',
          email: 'test@example.com',
          password: '1234',
          confirm: '1234',
          phoneNum: '01012345678',
          birthDate: '2000-01-01'
        });

      expect(res.statusCode).toBe(302); // redirect
      expect(res.headers.location).toBe('/login.html');
    });
  });

  describe('POST /login', () => {
    it('should fail login for invalid user', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'fail@example.com',
          password: 'wrong'
        });

      expect(res.statusCode).toBe(401);
    });

    it('should login successfully and return userId', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'success@example.com',
          password: 'correct'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.userId).toBe(1);
    });
  });

});
