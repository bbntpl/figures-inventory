const app = require('../app');
const supertest = require('supertest');
const mongoose = require('mongoose');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const Character = require('../models/character');
const { deleteTestDb } = require('./test_helper');

const api = supertest(app)

beforeEach(async () => {
	const { stderr } = await exec('npm run populate:test');
  if (stderr) {
    console.error('Error populating test database:', stderr);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
	deleteTestDb();
});

describe('Initial data', () => {
  it('populates the database', async () => {
		const response = await api
			.get('/characters')
			.expect('Content-Type', /text\/html/)
			.expect(200)

    expect(response.status).toBe(200);
    expect(response.body.characters.length).toEqual(5);
  });
});