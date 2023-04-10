const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

const api = supertest(app)

describe('initial view setup', () => {
	it('creates homepage view', async () => {
		const response = await api.get('/')
			.expect('Content-Type', /text\/html/)
			.expect(200)
		expect(response.text).toContain('Welcome to ABCXYZ Figures')
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})