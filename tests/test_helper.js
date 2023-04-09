const Figure = require('../models/figure');
const Character = require('../models/character');

const deleteTestDb = async () => {
	await Figure.deleteMany({});
	await Character.deleteMany({});
}

module.exports = { deleteTestDb }