require('dotenv').config()

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
const Figure = require("./models/figure");
const Character = require("./models/character");
const { readImageAsBuffer } = require('./utils/util_helper')

const mongoose = require('mongoose');
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const NODE_ENV = userArgs[0] || 'development'

const initialData = [
	{
		name: 'Ada Lovelace',
		image: {
			data: readImageAsBuffer('../public/images/ada_lovelace.jpeg'),
			contentType: 'image/jpeg'
		},
		character: {
			name: 'Ada Lovelace',
			franchise: 'Real Life'
		},
		description: 'A modern action figure of the world\'s first programmer - Ada Lovelace',
		manufacturer: 'TimeWarp Figurines',
		material: 'Painted Plastic',
		quantity: 1,
		price: 150
	},
	{
		name: 'Abraham Lincoln',
		image: {
			data: readImageAsBuffer('../public/images/abraham_lincoln.jpeg'),
			contentType: 'image/jpeg'
		},
		character: {
			name: 'Abraham Lincoln',
			franchise: 'Real Life'
		},
		description: 'A modern action figure of the 17th president of the United States - Abraham Lincoln',
		manufacturer: 'TimeWarp Figurines',
		material: 'Painted Plastic',
		quantity: 1,
		price: 325
	},
	{
		name: 'Zoro wearing Sabo\'s suit',
		image: {
			data: readImageAsBuffer('../public/images/zoro_in_sabo_suit.jpeg'),
			contentType: 'image/jpeg'
		},
		character: {
			name: 'Roronoa Zoro',
			franchise: 'One Piece'
		},
		description: 'The right hand of One Piece pirates; Roronoa Zoro',
		manufacturer: 'EpochArtisans Co.',
		material: 'Painted Plastic',
		quantity: 1,
		price: 199
	},
	{
		name: 'Path of Exile - Scion',
		character: {
			name: 'Scion',
			franchise: 'Path of Exile'
		},
		image: {
			data: readImageAsBuffer('../public/images/poe_scion.jpeg'),
			contentType: 'image/jpeg'
		},
		description: 'Scion is a unique and versatile character class in the popular action role-playing game, Path of Exile, developed by Grinding Gear Games. Introduced in 2013 as part of the "Release" version, Scion is a highly adaptable and customizable character, renowned for her ability to specialize in a wide range of playstyles.',
		manufacturer: 'EpochArtisans Co.',
		material: 'Painted Plastic',
		quantity: 1,
		price: 199
	},
	{
		name: 'Dark Souls - The Chosen Undead in Full Armor',
		character: {
			name: 'The Chosen Undead',
			franchise: 'Dark Souls'
		},
		image: {
			data: readImageAsBuffer('../public/images/darksouls_main.jpeg'),
			contentType: 'image/jpeg'
		},
		description: 'As the Chosen Undead clad in full armor marches towards their destiny, they embody the indomitable spirit of a true warrior, unyielding in their pursuit of a brighter future. The challenges that await may be unfathomable, but with unwavering resolve and an unbreakable will, the Chosen Undead stands ready to conquer the darkness and restore hope to a world on the brink of despair.',
		manufacturer: 'Metallite Creations',
		material: 'Painted Metal',
		quantity: 1,
		price: 899
	}
];

main().catch((err) => console.log(err));

async function connectToDB(nodeENV) {
	console.log("Debug: About to connect");
	const connectionString = nodeENV === 'test'
		? process.env.TEST_MONGODB_URI
		: process.env.MONGODB_URI
	return await mongoose.connect(connectionString);
}

async function main() {
	connectToDB(NODE_ENV);
	console.log("Debug: Should be connected?");
	await createFigures();
	console.log("Debug: Closing mongoose");
	mongoose.connection.close();
}

async function figureCreate(figureObject) {

	const figure = new Figure({ ...figureObject });
	await figure.save();
}

async function characterCreate(characterObject) {
	const character = new Character({ ...characterObject });
	await character.save();
	return character.id;
}

async function createFigures() {
	console.log('Creating figures...');

	for (const obj of initialData) {
		const { character, ...figureObject } = obj;
		const characterId = await characterCreate(character);
		await figureCreate({ ...figureObject, character: characterId });
	}
}