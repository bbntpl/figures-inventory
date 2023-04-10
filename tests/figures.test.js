const app = require('../app');
const supertest = require('supertest');
const mongoose = require('mongoose');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const Figure = require('../models/figure');
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
	deleteTestDb()
});

describe('Initial data', () => {
	it('populates the database', async () => {
		const figures = await Figure.find({})
		expect(figures).toHaveLength(5);
		expect(figures[0].name).toBe('Ada Lovelace')
	});
});

describe('figure read data', () => {
	it('successfully renders list of figures', async () => {
		const response = await api
			.get('/figures')
			.expect('Content-Type', /text\/html/)
			.expect(200)

		const expectedTexts = [
			'List of Figures',
			'<a>Ada Lovelace>/a>',
			'<a>Abraham Lincoln</a>',
			'<a>Zoro wearing Sabo\'s suit</a>'
		];

		expectedTexts.forEach(text => {
			expect(response.text).toContain(text)
		})
	});

	it('successfully expect 200 and display figure detail', async () => {
		const figures = await Figure.find({});
		const firstFigure = figures[0].id
		const response = await api
			.get(`/figures/${firstFigure.id}`)
			.expect('Content-Type', /text\/html/)
			.expect(200)

		expect(response.status).toBe(200);
		expect(response.text).toContain(firstFigure.name);
	});
});

describe('figure creation', () => {
	it('successfully renders the create figure view', async () => {
		const response = await api
			.get('/figures/create')
			.expect('Content-Type', /text\/html/)
			.expect(200);

		expect(response.text).toContain('Add your Figure Product');
	});

	it('successfully expect 200 with figure addition', async () => {
		const initialDocsInFigures = await Figure.countDocuments();
		const newFigureData = {
			name: 'Model A',
			image: {
				data: readImageAsBuffer('../public/images/default.jpeg'),
				contentType: 'image/jpeg'
			},
			character: {
				name: 'Model A',
				franchise: 'Tests'
			},
			description: 'This is for testing purposes',
			manufacturer: 'The Developer',
			material: 'Wood',
			quantity: 10,
			price: 5
		}

		await api
			.post('/figures/create')
			.send(newFigureData)
			.expect('Content-Type', /text\/html/)
			.expect(200)

		const updatedFigures = await Figure.find({})

		expect(updatedFigures.length).toBe(initialDocsInFigures + 1);
		expect(updatedFigures[initialDocsInFigures].name).toBe(newFigureData.name);
		expect(updatedFigures[initialDocsInFigures].description).toBe(newFigureData.description);
	});
});

describe('figure update', () => {
	it('successfully renders the update figure view', async () => {
		const figures = await Figure.find({});
		const firstFigure = figures[0];

		const response = await api
			.get(`/figures/${firstFigure.id}/edit`)
			.expect('Content-Type', /text\/html/)
			.expect(200);

		expect(response.text).toContain(`Edit Figure Information: ${firstFigure.name}`);
	});

	it('successfully updates a figure', async () => {
		const figures = await Figure.find({});
		const firstFigure = figures[0];
		const updatedData = {
			name: 'Updated Figure Name',
			description: 'Updated Figure Description'
		};

		await api
			.put(`/figures/${firstFigure.id}/edit`)
			.send({
				...firstFigure,
				name: updatedData.name,
				description: updatedData.description
			})
			.expect(200);

		const updatedFigure = await Figure.findById(firstFigure.id);
		expect(updatedFigure.name).toBe(updatedData.name);
		expect(updatedFigure.description).toBe(updatedData.description);
	});
});

describe('figure deletion', () => {
	it('successfully renders the delete figure view', async () => {
		const figures = await Figure.find({});
		const firstFigure = figures[0];

		const response = await api
			.get(`/figures/${firstFigure.id}/delete`)
			.expect('Content-Type', /text\/html/)
			.expect(200);

		expect(response.text).toContain(`Delete Figure: ${firstFigure.name}`);
	});

	it('successfully deletes a figure', async () => {
		const figures = await Figure.find({});
		const firstFigure = figures[0];

		await api
			.delete(`/figures/${firstFigure.id}/delete`)
			.expect(200);

		const deletedFigure = await Figure.findById(firstFigure.id);
		expect(deletedFigure).toBeNull();
	});
});