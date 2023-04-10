const Character = require('../models/figure');

exports.characterList = async (req, res) => {
	try{
		const characters = await Character.find({});

		res.render('character_collection', {
			title: 'List of Characters',
			characters,
		})
	} catch(err) {
		next(err)
	}
}

exports.characterDetail = async (req, res) => {
	res.send('GET - /characters/:id')
}

exports.characterCreateView = async (req, res) => {
	res.send('GET - /characters/:id/create')
}

exports.characterCreate = async (req, res) => {
	res.send('POST - /characters/:id/create')
}

exports.characterUpdateView = async (req, res) => {
	res.send('GET - /characters/:id/update')
}

exports.characterUpdate = async (req, res) => {
	res.send('POST - /characters/:id/update')
}

exports.characterDeletionView = async (req, res) => {
	res.send('GET - /characters/:id/delete')
}

exports.characterDelete = async (req, res) => {
	res.send('DELETE - /characters/:id/delete')
}