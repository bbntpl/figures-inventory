const { body, validationResult } = require('express-validator');
const Character = require('../models/character');

exports.characterList = async (req, res, next) => {
	try {
		const characters = await Character.find({});
		res.render('character_list', {
			title: 'Table of Characters',
			characters,
		})
	} catch (err) {
		next(err)
	}
}

exports.characterDetail = async (req, res, next) => {
	try {
		const character = await Character.findById(req.params.id);
		if (!character) {
			const err = new Error('Character not found');
			err.status = 404;
			return next(err);
		}
		res.render('character_detail', {
			character,
		});
	} catch (err) {
		next(err);
	}
};

exports.characterCreateView = async (req, res, next) => {
	console.log(req.params.id);
	try {
		res.render('character_create', { title: 'Create a New Character' });
	} catch (err) {
		next(err)
	}
};

exports.characterCreate = [
	body('name', 'Name is required')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('franchise', 'Franchise is required')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('background')
		.trim()
		.escape(),

	async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render('character_create', {
				title: 'Create Character',
				character: req.body,
				errors: errors.array(),
			});
			return;
		}

		try {
			const character = new Character({
				name: req.body.name,
				franchise: req.body.franchise,
				background: req.body.background,
			});

			await character.save();
			res.redirect(`/characters/${character._id}`);
		} catch (err) {
			next(err);
		}
	},
];

exports.characterUpdateView = async (req, res
	, next) => {
	try {
		const character = await Character.findById(req.params.id);
		if (!character) {
			const err = new Error('Character not found');
			err.status = 404;
			return next(err);
		}
		res.render('character_update', { title: 'Update Character', character });
	} catch (err) {
		next(err);
	}
};

exports.characterUpdate = [
	body('name', 'Name is required')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('franchise', 'Franchise is required')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('background')
		.trim()
		.escape(),

	async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render('character_update', {
				title: 'Update Character',
				character: req.body,
				errors: errors.array(),
			});
			return;
		}

		try {
			const updatedCharacter = {
				name: req.body.name,
				franchise: req.body.franchise,
				background: req.body.background,
			};

			await Character.findByIdAndUpdate(req.params.id, updatedCharacter);
			res.status(201).redirect(`/characters/${req.params.id}`);
		} catch (err) {
			next(err);
		}
	},
];

exports.characterDeletionView = async (req, res, next) => {
	try {
		const character = await Character.findById(req.params.id);
		if (!character) {
			const err = new Error('Character not found');
			err.status = 404;
			return next(err);
		}
		res.render('character_delete', { title: 'Delete Character', character });
	} catch (err) {
		next(err);
	}
};

exports.characterDelete = async (req, res, next) => {
	try {
		await Character.findByIdAndRemove(req.params.id);
		res.status(204).redirect('/characters');
	} catch (err) {
		next(err);
	}
};