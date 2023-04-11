const Figure = require('../models/figure')

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
				title: 'List of Figures',
				figures: figuresWithImageSrc
			});
		})
		.catch(err => {
			// An error has occurred
			next(`Error fetching figures: ${err}`)
		})
}

exports.figureDetail = async (req, res) => {
	await Figure.findById(req.params.id)
		.populate('character')
		.then(figure => {
			const { image, ...figureWithoutImage } = figure;
			// Convert buffer to base64-encoded string
			const base64Image = image.data.toString('base64');
			const imageSrc = `data:${image.contentType};base64,${base64Image}`;

			//Successful, so render
			res.render('figure_list', {
				title: 'List of Figures',
				figures: figureWithoutImage,
				imageSrc
			});
		})
		.catch(err => {
			// An error has occurred
			next(`Error fetching figures: ${err}`)
		})
}

exports.figureCreateView = async (req, res) => {
	res.send('GET - /figures/create')
}

exports.figureCreate = async (req, res) => {
	res.send('POST - /figures/create')
}

exports.figureUpdateView = async (req, res) => {
	res.send('GET - /figures/:id/update')
}

exports.figureUpdate = async (req, res) => {
	res.send('POST - /figures/:id/update')
}

exports.figureDeletionView = async (req, res) => {
	res.send('GET - /figures/:id/delete')
}

exports.figureDelete = async (req, res) => {
	res.send('DELETE - /figures/:id/delete')
}