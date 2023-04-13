const app = require('../app');
const supertest = require('supertest');
const mongoose = require('mongoose');
const { Readable } = require('stream');

const Figure = require('../models/figure');
const {
	populateDb,
	deleteTestDb,
	readImageAsBuffer
} = require('../utils/util_helper');
const Character = require('../models/character');

const api = supertest(app)

beforeEach(async () => {
	await deleteTestDb();
	await populateDb().catch((err) => console.log(err))
});

describe('Initial data', () => {
	it('populates the database', async () => {
		const figures = await Figure.find({});
		expect(figures).toHaveLength(5);
		expect(figures[0].name).toBe('Ada Lovelace');
	});
});

describe('figure read data', () => {
	it('successfully renders list of figures', async () => {
		const response = await api
			.get('/figures')
			.expect('Content-Type', /text\/html/)
			.expect(200)

		const expectedTexts = [
			'User Figure Marketplace',
			'Total number of figures: 5',
			'Ada Lovelace',
			'Abraham Lincoln',
			'Zoro wearing Sabo\'s suit',
			'Path of Exile - Scion',
			'Dark Souls - The Chosen Undead in Full Armor'
		];

		expectedTexts.forEach(text => {
			expect(response.text).toContain(text)
		})
		expect(response.text).not.toContain('Buffer');
	});

	it('successfully renders the figure detail', async () => {
		const figures = await Figure.find({}).populate('character');
		const firstFigure = figures[0]
		const response = await api
			.get(`/figures/${firstFigure.id}`)
			.expect('Content-Type', /text\/html/)
			.expect(200)
		const { character } = firstFigure;

		expect(response.text).toContain(`${character.name} (${character.franchise})`);
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

	it('successfully create a figure', async () => {
		const initialDocsInFigures = await Figure.countDocuments();
		const character = await Character.findOne({});
		const buffer = readImageAsBuffer('../public/images/default.png');

		const response = await api
			.post('/figures/create')
			.field('name', 'Model A')
			.field('character', character._id.toString())
			.field('description', 'This is for testing purposes')
			.field('manufacturer', 'The Developer')
			.field('material', 'Wood')
			.field('quantity', 10)
			.field('price', 5)
			.attach('image', buffer, 'default.png')
			.expect(302)
			.catch((err) => {
				// handle the error and show a custom error message with more details
				throw new Error(`Error occurred during the test: ${err.message}`);
			});
		const updatedDocsInFigures = await Figure.countDocuments();
		const newFigure = await Figure.findOne({ name: 'Model A' });
		
		expect(updatedDocsInFigures).toEqual(initialDocsInFigures + 1);
		expect(newFigure.character).toStrictEqual(character._id);
		expect(newFigure.description).toBe('This is for testing purposes');
		expect(newFigure.image).toHaveProperty('data');
		expect(newFigure.image).toHaveProperty('contentType', 'image/png');

		// check if the redirect URL contains the /characters
		expect(response.header.location).toBe(`/figures/${newFigure.id}`)
	});
});

describe('figure edit', () => {
	it('successfully renders the edit figure view', async () => {
		const figures = await Figure.find({});
		const firstFigure = figures[0];

		const response = await api
			.get(`/figures/${firstFigure.id}/edit`)
			.expect('Content-Type', /text\/html/)
			.expect(200);

		expect(response.text).toContain(`Edit Figure Information: ${firstFigure.name}`);
	});

	it('successfully edits a figure', async () => {
		const figures = await Figure.find({});
		const firstFigure = figures[0];
		const updatedData = {
			name: 'Updated Figure Name',
			description: 'Updated Figure Description'
		};

		const buffer = readImageAsBuffer('../public/images/default.png')
		const response = await api
			.post(`/figures/${firstFigure.id}/edit`)
			.send({
				character: firstFigure.character,
				price: firstFigure.price,
				material: firstFigure.material,
				manufacturer: firstFigure.manufacturer,
				quantity: firstFigure.quantity,
				name: updatedData.name,
				description: updatedData.description,
				existingImageData: buffer,
				existingImageContentType: 'image/png',
				_method: 'PUT'
			})
			.expect(302);

		const updatedFigure = await Figure.findById(firstFigure.id);
		expect(updatedFigure.name).toBe(updatedData.name);
		expect(updatedFigure.description).toBe(updatedData.description);

		// check if the redirect URL contains the /characters
		expect(response.header.location).toBe(`/figures/${firstFigure.id}`)
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

		const response = await api
			.post(`/figures/${firstFigure.id}/delete`)
			.send({ _method: 'DELETE' })
			.expect(302);

		const deletedFigure = await Figure.findById(firstFigure.id);
		expect(deletedFigure).toBeNull();

		// check if the redirect URL contains the /characters
		expect(response.header.location).toBe('/figures')
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});