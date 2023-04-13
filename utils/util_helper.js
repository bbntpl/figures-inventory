const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Figure = require('../models/figure');
const Character = require('../models/character');

function readImageAsBuffer(imagePath) {
	const fullPath = path.join(__dirname, imagePath);
	return fs.readFileSync(fullPath);
}

// Convert image from mongoDB document to a image source
function imageFromDocToImageSrc(imgFromDoc) {
	// use default image if figure does not have image
	const image = (!imgFromDoc || (imgFromDoc && (imgFromDoc.data === undefined || imgFromDoc.data === null)))
		? {
			data: readImageAsBuffer('../public/images/default.png'),
			contentType: 'image/png',
		}
		: imgFromDoc;
		
	// Convert buffer to base64-encoded string
	const base64Image = image.data.toString('base64');
	const imageSrc = `data:${image.contentType};base64,${base64Image}`;

	return imageSrc
}

function isEmptyObject(obj) {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}

const initialData = [
	{
		name: 'Ada Lovelace',
		image: {
			data: readImageAsBuffer('../public/images/figures/ada_lovelace.jpeg'),
			contentType: 'image/jpeg'
		},
		character: {
			name: 'Ada Lovelace',
			franchise: 'Historical Figures'
		},
		description: 'A modern action figure of the world\'s first programmer - Ada Lovelace',
		manufacturer: 'TimeWarp Figurines',
		material: 'Painted Plastic',
		quantity: 3,
		price: 150
	},
	{
		name: 'Abraham Lincoln',
		image: {
			data: readImageAsBuffer('../public/images/figures/abraham_lincoln.jpeg'),
			contentType: 'image/jpeg'
		},
		character: {
			name: 'Abraham Lincoln',
			franchise: 'Historical Figures'
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
			data: readImageAsBuffer('../public/images/figures/zoro_in_sabo_suit.jpeg'),
			contentType: 'image/jpeg'
		},
		character: {
			name: 'Roronoa Zoro',
			franchise: 'One Piece'
		},
		description: 'The right hand of Straw Hat pirates; Roronoa Zoro. But wait, he is wearing Sabo\'s outfit!!! How could that be?!?!?!!',
		manufacturer: 'EpochArtisans Co.',
		material: 'Painted Plastic',
		quantity: 1,
		price: 41
	},
	{
		name: 'Path of Exile - Scion',
		character: {
			name: 'Scion',
			franchise: 'Path of Exile'
		},
		image: {
			data: readImageAsBuffer('../public/images/figures/poe_scion.jpeg'),
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
			data: readImageAsBuffer('../public/images/figures/darksouls_main.jpeg'),
			contentType: 'image/jpeg'
		},
		description: 'As the Chosen Undead clad in full armor marches towards their destiny, they embody the indomitable spirit of a true warrior, unyielding in their pursuit of a brighter future. The challenges that await may be unfathomable, but with unwavering resolve and an unbreakable will, the Chosen Undead stands ready to conquer the darkness and restore hope to a world on the brink of despair.',
		manufacturer: 'Metallite Creations',
		material: 'Painted Metal',
		quantity: 1,
		price: 899
	}
];

/* populating purposes */

async function populateDbThenClose() {
	try {
		console.log("Debug: Should be connected?");
		await createFigures();
	} catch (err) {
		console.error("Error while creating figures:", err);
	} finally {
		await mongoose.connection.close();
	}
}

async function populateDb() {
	console.log("Debug: Should be connected?");
	await createFigures();
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

async function createCharacters() {
	console.log('Creating characters...');

	for (const obj of initialData) {
		const { character } = obj;
		await characterCreate(character);
	}
}

const deleteTestDb = async () => {
	await Figure.deleteMany({});
	await Character.deleteMany({});
}

module.exports = {
	readImageAsBuffer,
	populateDb,
	populateDbThenClose,
	createCharacters,
	deleteTestDb,
	isEmptyObject,
	imageFromDocToImageSrc
}