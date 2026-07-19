const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const { genereteAuthToken } = require('../helpers/auth');

jest.mock('../helpers/secrets.js');

const agent = supertest.agent(app);

const entry = {
  type: 'expense',
  amount: 4250,
  category: 'food',
  description: 'Weekly groceries',
  note: 'Local market',
  date: '2026-07-18T12:00:00.000Z'
};

const createUser = email =>
  new User({
    email,
    password: 'testtest',
    name: 'Diary',
    lastname: 'User',
    lang: 'en',
    active: true
  }).save();

const cookieFor = user => `accessToken=${genereteAuthToken(user).token}`;

beforeAll(async () => db.connect());
beforeEach(async () => db.clear());
afterEach(() => jest.clearAllMocks());
afterAll(async () => db.close());

describe('transactions API', () => {
  test('requires authentication', () => agent.get('/transactions').expect(401));

  test('creates, reads, updates, and deletes an entry', async () => {
    const user = await createUser('owner@example.com');
    const cookie = cookieFor(user);

    const created = await agent.post('/transactions').set('Cookie', cookie).send(entry).expect(201);

    expect(created.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        ...entry,
        date: entry.date,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    );

    const id = created.body._id;
    await agent
      .get(`/transactions/${id}`)
      .set('Cookie', cookie)
      .expect(200)
      .then(response => expect(response.body.description).toBe(entry.description));

    await agent
      .patch(`/transactions/${id}`)
      .set('Cookie', cookie)
      .send({ amount: 5000, description: 'Groceries and toiletries' })
      .expect(200)
      .then(response => {
        expect(response.body.amount).toBe(5000);
        expect(response.body.description).toBe('Groceries and toiletries');
      });

    await agent.delete(`/transactions/${id}`).set('Cookie', cookie).expect(200);
    await agent.get(`/transactions/${id}`).set('Cookie', cookie).expect(404);
  });

  test('lists only the signed-in user entries and applies filters', async () => {
    const owner = await createUser('owner@example.com');
    const otherUser = await createUser('other@example.com');

    await Transaction.create([
      { ...entry, userId: owner._id },
      {
        ...entry,
        userId: owner._id,
        type: 'income',
        category: 'salary',
        amount: 250000,
        description: 'Salary'
      },
      { ...entry, userId: otherUser._id, description: 'Private entry' }
    ]);

    await agent
      .get('/transactions?type=expense&from=2026-07-01T00:00:00.000Z&to=2026-07-31T23:59:59.999Z')
      .set('Cookie', cookieFor(owner))
      .expect(200)
      .then(response => {
        expect(response.body).toHaveLength(1);
        expect(response.body[0].description).toBe(entry.description);
      });
  });

  test('returns the complete bounded month without silently truncating totals', async () => {
    const owner = await createUser('high-volume@example.com');
    const entries = Array.from({ length: 501 }, (_, index) => ({
      ...entry,
      userId: owner._id,
      amount: index + 1,
      description: `Entry ${index + 1}`
    }));
    await Transaction.insertMany(entries);

    await agent
      .get('/transactions?from=2026-07-01T00:00:00.000Z&to=2026-07-31T23:59:59.999Z')
      .set('Cookie', cookieFor(owner))
      .expect(200)
      .then(response => expect(response.body).toHaveLength(501));
  });

  test('rejects malformed or unexpected data', async () => {
    const user = await createUser('owner@example.com');
    const cookie = cookieFor(user);

    await agent
      .post('/transactions')
      .set('Cookie', cookie)
      .send({ ...entry, amount: 10.5 })
      .expect(400);
    await agent
      .post('/transactions')
      .set('Cookie', cookie)
      .send({ ...entry, userId: user.id })
      .expect(400);
    await agent.get('/transactions?type=transfer').set('Cookie', cookie).expect(400);
  });

  test('does not expose entries owned by another user', async () => {
    const owner = await createUser('owner@example.com');
    const otherUser = await createUser('other@example.com');
    const transaction = await Transaction.create({ ...entry, userId: owner._id });
    const otherCookie = cookieFor(otherUser);

    await agent.get(`/transactions/${transaction.id}`).set('Cookie', otherCookie).expect(404);
    await agent.patch(`/transactions/${transaction.id}`).set('Cookie', otherCookie).send({ amount: 1 }).expect(404);
    await agent.delete(`/transactions/${transaction.id}`).set('Cookie', otherCookie).expect(404);
  });
});
