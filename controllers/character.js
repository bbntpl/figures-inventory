const Character = require('../models/figure');

exports.characterList = async (req, res) => {
	try{
		const characters = await Character.find({});

		res.render('character_collection', {
			title: 'Characters',
			characters,
		})
	} catch(err) {
		next(err)
	}
}