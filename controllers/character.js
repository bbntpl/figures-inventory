const { body, validationResult } = require('express-validator');
const Character = require('../models/character');
const Figure = require('../models/figure');

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
	try {
		res.render('character_form', { 
			title: 'Create a New Character', 
			actionType: 'Create',
		});
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
			res.render('character_form', {
				title: 'Create a New Character',
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

exports.characterEditView = async (req, res, next) => {
	try {
		const character = await Character.findById(req.params.id);
		if (!character) {
			const err = new Error('Character not found');
			err.status = 404;
			return next(err);
		}

		res.render('character_form', {
			title: `Edit Character: ${character.name}`,
			actionType: 'Edit',
			character
		});
	} catch (err) {
		next(err);
	}
};

exports.characterEdit = [
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
			res.render('character_form', {
				title: `Edit Character: ${req.body.name}`,
				action: 'Edit',
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
		res.render('character_delete', { 
			title: 'Delete Character', 
			character,
			figures: undefined 
		});
	} catch (err) {
		next(err);
	}
};

exports.characterDelete = async (req, res, next) => {
	try {
		const figures = await Figure.find({ character: req.params.id });

		// delete the charactr if there is no associated existing figure product
		if(figures.length <= 0) {
			await Character.findByIdAndRemove(req.params.id);
			return res.status(204).redirect('/characters');
		}

		const character = await Character.findById(req.params.id);
		res.render('character_delete', { 
			title: 'Delete Character', 
			figures,
			character
		});
	} catch (err) {
		next(err);
	}
};