const { body, validationResult } = require('express-validator');
const multer = require('multer');
const Figure = require('../models/figure');

const upload = multer({ storage: multer.memoryStorage() });

exports.figureList = async (req, res, next) => {
	await Figure.find({})
		.populate('character')
		.then(figures => {
			// Map figures array to a new array with imageSrc added
			const figuresWithImageSrc = figures.map(figure => {

				// Convert buffer to base64-encoded string
				const base64Image = figure.image.data.toString('base64');
				const imageSrc = `data:${figure.image.contentType};base64,${base64Image}`;

				// Return a new object with all properties and the imageSrc
				return {
					name: figure.name,
					character: figure.character,
					description: figure.description,
					price: figure.price,
					id: figure.id,
					imageSrc
				};
			});

			//Successful, so render
			res.render('figure_list', {
				title: 'User Figure Marketplace',
				figures: figuresWithImageSrc
			});
		})
		.catch(err => {
			// An error has occurred
			next(`Error fetching figures: ${err}`)
		})
}

exports.figureDetail = async (req, res, next) => {
	await Figure.findById(req.params.id)
		.populate('character')
		.then(figure => {
			// Convert buffer to base64-encoded string
			const base64Image = image.data.toString('base64');
			const imageSrc = `data:${image.contentType};base64,${base64Image}`;

			//Successful, so render
			res.render('figure_detail', {
				figure,
				imageSrc
			});
		})
		.catch(err => {
			// An error has occurred
			next(`Error fetching figures: ${err}`)
		})
}

exports.figureCreateView = async (req, res) => {
	res.render('figure_create', { title: 'Create a New Figure' });
};

exports.figureCreate = [
	upload.single('image'),
	body('name', 'Name is required').trim().isLength({ min: 1 }).escape(),
	body('description', 'Description is required').trim().isLength({ min: 1 }).escape(),
	body('price', 'Price is required').isNumeric().toFloat(),

	async (req, res, next) => {
		const errors = validationResult(req);

		const figure = new Figure({
			name: req.body.name,
			character: req.body.character,
			description: req.body.description,
			price: req.body.price,
			image: {
				data: req.file.buffer,
				contentType: req.file.mimetype,
			},
		});

		if (!errors.isEmpty()) {
			res.render('figure_create', {
				title: 'Create a New Figure',
				figure,
				errors: errors.array()
			});
			return;
		}

		try {
			await figure.save();
			res.redirect(figure.url);
		} catch (err) {
			next(err);
		}
	},
];

exports.figureUpdateView = async (req, res, next) => {
	try {
		const figure = await Figure.findById(req.params.id);
		res.render('figure_update', { title: 'Update Figure', figure });
	} catch (err) {
		next(err);
	}
};

exports.figureUpdate = [
	upload.single('image'),
	body('name', 'Name is required').trim().isLength({ min: 1 }).escape(),
	body('description', 'Description is required').trim().isLength({ min: 1 }).escape(),
	body('price', 'Price is required').isNumeric().toFloat(),

	async (req, res, next) => {
		const errors = validationResult(req);

		const updatedFigure = {
			name: req.body.name,
			character: req.body.character,
			description: req.body.description,
			price: req.body.price,
			image: {
				data: req.file.buffer,
				contentType: req.file.mimetype,
			},
		};

		if (!errors.isEmpty()) {
			res.render('figure_update', { title: 'Update Figure', figure: updatedFigure, errors: errors.array() });
			return;
		}

		try {
			await Figure.findByIdAndUpdate(req.params.id, updatedFigure);
			res.redirect(`/figures/${req.params.id}`);
		} catch (err) {
			next(err);
		}
	},
];

exports.figureDeletionView = async (req, res, next) => {
	try {
		const figure = await Figure.findById(req.params.id);
		res.render('figure_delete', { title: 'Delete Figure', figure });
	} catch (err) {
		next(err);
	}
};

exports.figureDelete = async (req, res, next) => {
	try {
		await Figure.findByIdAndRemove(req.params.id);
		res.redirect('/figures');
	} catch (err) {
		next(err);
	}
};