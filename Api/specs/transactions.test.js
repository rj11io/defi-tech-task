const supertest = require('supertest');
const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const { genereteAuthToken } = require('../helpers/auth');

jest.mock('../helpers/secrets.js');

let agent;
let user;
let otherUser;
let token;

beforeAll(async () => db.connect());
beforeEach(async () => {
  await db.clear();
  user = await new User({
    email: 'diary@meblabs.com',
    password: 'testtest',
    name: 'Diary',
    lastname: 'Owner',
    active: true
  }).save();
  otherUser = await new User({
    email: 'other@meblabs.com',
    password: 'testtest',
    name: 'Other',
    lastname: 'Owner',
    active: true
  }).save();
  token = genereteAuthToken(user).token;
  agent = supertest.agent(app);
});
afterAll(async () => db.close());

const auth = request => request.set('Cookie', `accessToken=${token}`);

describe('Transactions CRUD', () => {
  test('requires authentication', () => agent.get('/transactions').expect(401));

  test('creates and lists a transaction for the signed-in user', async () => {
    const created = await auth(agent.post('/transactions'))
      .send({ type: 'expense', amount: 12.5, description: 'Lunch', category: 'Food', date: '2026-07-19T12:00:00.000Z' })
      .expect(201);

    expect(created.body).toEqual(expect.objectContaining({ type: 'expense', amount: 12.5, description: 'Lunch' }));
    const listed = await auth(agent.get('/transactions')).expect(200);
    expect(listed.body).toHaveLength(1);
    expect(listed.headers['x-total-count']).toBe('1');
  });

  test('updates and deletes only owned transactions', async () => {
    const owned = await new Transaction({
      user: user._id,
      type: 'income',
      amountCents: 20000,
      description: 'Salary',
      category: 'Work',
      date: new Date('2026-07-01T00:00:00.000Z')
    }).save();
    const foreign = await new Transaction({
      user: otherUser._id,
      type: 'expense',
      amountCents: 500,
      description: 'Private',
      date: new Date('2026-07-02T00:00:00.000Z')
    }).save();

    await auth(agent.patch(`/transactions/${owned.id}`))
      .send({ amount: 225, type: 'income' })
      .expect(200);
    expect((await Transaction.findById(owned.id)).amountCents).toBe(22500);
    await auth(agent.get(`/transactions/${foreign.id}`)).expect(404);
    await auth(agent.delete(`/transactions/${foreign.id}`)).expect(404);
    await auth(agent.delete(`/transactions/${owned.id}`)).expect(200);
    expect(await Transaction.findById(owned.id)).toBeNull();
  });

  test('rejects invalid input before persistence', async () => {
    await auth(agent.post('/transactions'))
      .send({ type: 'expense', amount: 0.001, description: ' ', date: 'not-a-date', unexpected: true })
      .expect(400);
    expect(await Transaction.countDocuments()).toBe(0);
  });

  test('filters safely by type and search text', async () => {
    await Transaction.insertMany([
      {
        user: user._id,
        type: 'income',
        amountCents: 1000,
        description: 'Client payment',
        category: 'Work',
        date: new Date('2026-07-01T00:00:00.000Z')
      },
      {
        user: user._id,
        type: 'expense',
        amountCents: 500,
        description: 'Office supplies',
        category: 'Work',
        date: new Date('2026-07-02T00:00:00.000Z')
      }
    ]);

    const response = await auth(agent.get('/transactions?type=income&search=client%20payment')).expect(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].description).toBe('Client payment');
  });
});
