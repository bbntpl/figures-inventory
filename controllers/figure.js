const { body, validationResult } = require('express-validator');
const multer = require('multer');
const Figure = require('../models/figure');
const Character = require('../models/character');
const upload = require('../utils/multerConfig');
const { imageFromDocToImageSrc } = require('../utils/util_helper');

exports.figureList = async (req, res, next) => {
	await Figure.find({})
		.populate('character')
		.sort({ added: -1 })
		.then(figures => {
			// Map figures array to a new array with imageSrc added
			const figuresWithImageSrc = figures.map(figure => {
				const imageSrc = imageFromDocToImageSrc(figure.image)

				// Return the new object with all properties and the imageSrc
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
			const imageSrc = imageFromDocToImageSrc(figure.image)

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

exports.figureCreateView = async (req, res, next) => {
	try {
		const characters = await Character.find({}).sort({ name: 1 });
		res.render('figure_form', {
			title: 'Add your Figure Product',
			characters,
			actionType: 'Create'
		});
	} catch (err) {
		next(err)
	}
};

exports.figureCreate = [
	(req, res, next) => {
		const uploadMiddleware = upload.single('image');
		uploadMiddleware(req, res, async (err) => {
			const characters = await Character.find({});
			if (err instanceof multer.MulterError) {
				return res.status(400).render('figure_form', {
					title: 'Add your Figure Product',
					characters,
					actionType: 'Create',
					errors: [{
						msg: err.code === 'LIMIT_FILE_SIZE'
							? 'File size too large. Maximum limit is 4MB.'
							: err.message
					}],
				});
			} else if (err) {
				return res.status(400).render('figure_form', {
					title: 'Add your Figure Product',
					characters,
					actionType: 'Create',
					errors: [{ msg: err.message }],
				});
			}
			next();
		});
	},
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
			image: req.file !== undefined
				? {
					data: req.file.buffer,
					contentType: req.file.mimetype,
				}
				: undefined,
			material: req.body.material,
			manufacturer: req.body.manufacturer,
			quantity: req.body.quantity || 1
		});

		if (!errors.isEmpty()) {
			const characters = await Character.find({}).sort({ name: 1 });

			res.render('figure_form', {
				title: 'Add your Figure Product',
				figure,
				characters,
				actionType: 'Create',
				errors: errors.array()
			});
			return;
		}

		try {
			const savedFigure = await figure.save();
			res.redirect(`/figures/${savedFigure.id}`);
		} catch (err) {
			next(err);
		}
	},
];

exports.figureEditView = async (req, res, next) => {
	try {
		const characters = await Character.find({}).sort({ name: 1 });
		const figure = await Figure.findById(req.params.id);
		const imageSrc = imageFromDocToImageSrc(figure.image);

		// render the figure form for update
		res.render('figure_form', {
			title: `Edit Figure Information: ${figure.name}`,
			figure,
			actionType: 'Edit',
			imageSrc,
			characters,
		});
	} catch (err) {
		next(err);
	}
};

exports.figureEdit = [
	(req, res, next) => {
		const uploadMiddleware = upload.single('image');
		uploadMiddleware(req, res, async (err) => {
			const characters = await Character.find({});

			const imageSrc = req.file
				? imageFromDocToImageSrc({
					data: req.file.buffer,
					contentType: req.file.mimeType,
				})
				: imageFromDocToImageSrc(req.body.image);

			if (err instanceof multer.MulterError) {
				return res.status(400).render('figure_form', {
					title: 'Add your Figure Product',
					characters,
					imageSrc,
					actionType: 'Edit',
					errors: [{
						msg: err.code === 'LIMIT_FILE_SIZE'
							? 'File size too large. Maximum limit is 2MB.'
							: err.message
					}],
				});
			} else if (err) {
				return res.status(400).render('figure_form', {
					title: 'Add your Figure Product',
					characters,
					imageSrc,
					actionType: 'Edit',
					errors: [{ msg: err.message }],
				});
			}
			next();
		});
	},
	body('name', 'Name is required').trim().isLength({ min: 1 }).escape(),
	body('description', 'Description is required').trim().isLength({ min: 1 }).escape(),
	body('material', 'Material is required').trim().isLength({ min: 1 }).escape(),
	body('manufacturer', 'Manufacturer is required').trim().isLength({ min: 1 }).escape(),
	body('price', 'Price is required').isNumeric().toFloat(),
	async (req, res, next) => {
		const errors = validationResult(req);

		const updatedFigure = {
			name: req.body.name,
			character: req.body.character,
			description: req.body.description,
			price: req.body.price,
			image: req.file
				? {
					data: req.file.buffer,
					contentType: req.file.mimeType
				}
				: {
					data: Buffer.from(req.body.existingImageData, 'base64'),
					contentType: req.body.existingImageContentType
				},
			material: req.body.material,
			manufacturer: req.body.manufacturer,
			modified: Date.now(),
			quantity: req.body.quantity || 1
		};

		if (!errors.isEmpty()) {
			const characters = await Character.find({}).sort({ name: 1 })
			const imageSrc = req.file
				? imageFromDocToImageSrc({
					data: req.file.buffer,
					contentType: req.file.mimeType,
				})
				: imageFromDocToImageSrc(req.body.image);

			res.render('figure_form', {
				title: `Edit Figure Information: ${updatedFigure.name}`,
				figure: updatedFigure,
				actionType: 'Edit',
				characters,
				imageSrc,
				errors: errors.array()
			});
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
		const figure = await Figure
			.findById(req.params.id)
			.populate('character');
		res.render('figure_delete', { figure });
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