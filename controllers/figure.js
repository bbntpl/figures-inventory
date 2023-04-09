const Figure = require('../models/figure')

exports.figureList = async (req, res) => {
	await Figure.find({})
		.exec()
		.then((figures) => {
			//Successful, so render
			res.render("author_list", {
				title: 'figure_collection',
				figures,
			});
		})
		.catch(err => {
			//Failed, so dispaly error
			next(`Error fetching figures: ${err}`)
		})
}