const app = require('../app');
const supertest = require('supertest');
const mongoose = require('mongoose');

const Character = require('../models/character');
const { createCharacters } = require('../utils/util_helper');

const api = supertest(app)

beforeEach(async () => {
	await Character.deleteMany({});
	await createCharacters().catch((err) => console.log(err))
});

describe('Initial data', () => {
  it('populates the database', async () => {
		const characters = await Character.countDocuments({});
    expect(characters).toEqual(5);
  });
});

describe('character list', () => {
	it('successfully renders the list of characters', async () => {
		const response = await api
			.get('/characters')
			.expect('Content-Type', /text\/html/)
			.expect(200);

		expect(response.status).toBe(200);
		expect(response.text).toContain('Table of Characters');
	});
});

describe('character detail', () => {
	it('successfully renders a character detail', async () => {
		const characters = await Character.find({});
		const firstCharacter = characters[0];

		const response = await api
			.get(`/characters/${firstCharacter.id}`)
			.expect('Content-Type', /text\/html/)
			.expect(200);

		expect(response.text).toContain('Character Detail');
		expect(response.text).toContain(firstCharacter.name);
	});
});

describe('character creation', () => {
	it('successfully renders the create character view', async () => {
		const response = await api
			.get('/characters/create')
			.expect('Content-Type', /text\/html/)
			.expect(200);

		expect(response.text).toContain('Create a New Character');
	});

	it('successfully creates a character', async () => {
		const newCharacterData = {
			name: 'New Character',
			franchise: 'New Franchise'
		};

		await api
			.post('/characters/create')
			.send(newCharacterData)
			.expect(201);

		const newCharacter = await Character.findOne({ name: 'New Character' });
		expect(newCharacter.name).toBe(newCharacterData.name);
		expect(newCharacter.franchise).toBe(newCharacterData.franchise);
	});
});

describe('character edit', () => {
	it('successfully renders the update character view', async () => {
		const characters = await Character.find({});
		const firstCharacter = characters[0];

		const response = await api
			.get(`/characters/${firstCharacter.id}/edit`)
			.expect('Content-Type', /text\/html/)
			.expect(200);

		expect(response.text).toContain(`Edit Character: ${firstCharacter.name}`);
	});

	it('successfully edits a character', async () => {
		const characters = await Character.find({});
		const firstCharacter = characters[0];
		const updatedData = {
			name: 'Updated Character Name',
			franchise: 'Updated Franchise'
		};

		await api
			.put(`/characters/${firstCharacter.id}/edit`)
			.send(updatedData)
			.expect(200);

		const updatedCharacter = await Character.findById(firstCharacter.id);
		expect(updatedCharacter.name).toBe(updatedData.name);
		expect(updatedCharacter.franchise).toBe(updatedData.franchise);
	});
});

describe('character deletion', () => {
	it('successfully renders the delete character view', async () => {
		const characters = await Character.find({});
		const firstCharacter = characters[0];

		const response = await api
			.get(`/characters/${firstCharacter.id}/delete`)
			.expect('Content-Type', /text\/html/)
			.expect(200);

		expect(response.text).toContain(`Delete Character: ${firstCharacter.name}`);
	});

	it('successfully deletes a character', async () => {
		const characters = await Character.find({});
		const firstCharacter = characters[0];

		await api
			.delete(`/characters/${firstCharacter.id}/delete`)
			.expect(204);

		const deletedCharacter = await Character.findById(firstCharacter.id);
		expect(deletedCharacter).toBeNull();
	});
});

afterAll(async () => {
  await mongoose.connection.close();
});