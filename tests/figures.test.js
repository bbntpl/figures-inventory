const app = require('../app');
const supertest = require('supertest');
const mongoose = require('mongoose');

const Figure = require('../models/figure');
const {
	populateDb,
	deleteTestDb,
	readImageAsBuffer
} = require('../utils/util_helper');

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
		const newFigureData = {
			name: 'Model A',
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

		// create a middleware function to bypass Multer and add file to req.file
		const bypassMulter = (req, res, next) => {
			const image = readImageAsBuffer('../public/images/default.png')
			req.file = {
				fieldname: 'image',
				originalname: 'default.png',
				buffer: image.buffer,
				mimetype: image.contentType,
			};
			console.log(req.file)
			next();
		};

		// add the bypassMulter middleware to your app handling upload
		app.use(bypassMulter);

		const response = await api
			.post('/figures/create')
			.send({ ...newFigureData, image: undefined }) // image in unneeded because bypassMulter handled it already
			.expect('Content-Type', /text\/html/)
			.expect(302)

		const updatedFigures = await Figure.find({})
		const newFigure = await Figure.findOne({ name: 'New Character' });

		expect(updatedFigures.length).toBe(initialDocsInFigures + 1);
		expect(updatedFigures[initialDocsInFigures].name).toBe(newFigureData.name);
		expect(updatedFigures[initialDocsInFigures].description).toBe(newFigureData.description);

		// check if the redirect URL contains the /characters
		expect(response.header.location).toBe(`/figures/${newFigure.id}`)

		// remove the bypassMulter middleware after the test
		app._router.stack.pop();
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

		// create a middleware function to bypass Multer and add file to req.file
		const bypassMulter = (req, res, next) => {
			const image = readImageAsBuffer('../public/images/default.png')
			req.file = {
				fieldname: 'image',
				originalname: 'default.png',
				buffer: image.buffer,
				mimetype: image.contentType,
			};
			console.log(req.file)
			next();
		};

		app.use(bypassMulter);

		const response = await api
			.post(`/figures/${firstFigure.id}/edit`)
			.send({
				...firstFigure,
				name: updatedData.name,
				description: updatedData.description,
				_method: 'PUT'
			})
			.expect(302);

		const updatedFigure = await Figure.findById(firstFigure.id);
		expect(updatedFigure.name).toBe(updatedData.name);
		expect(updatedFigure.description).toBe(updatedData.description);

		// check if the redirect URL contains the /characters
		expect(response.header.location).toBe(`/figures/${firstFigure.id}`)

		// remove the bypassMulter middleware after the test
		app._router.stack.pop();
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