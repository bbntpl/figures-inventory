const Figure = require('../models/figure')

exports.figureList = async (req, res) => {
	await Figure.find({})
		.exec()
		.then((figures) => {
			//Successful, so render
			res.render('figure_collection', {
				title: 'List of Figures',
				figures,
			});
		})
		.catch(err => {
			//Failed, so dispaly error
			next(`Error fetching figures: ${err}`)
		})
}

exports.figureDetail = async (req, res) => {
	res.send('GET - /figures/:id')
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