const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	franchise: {
		type: String,
		required: true
	}
})

characterSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) {
		// Remove the _id field and add an id field with the same value
		ret.id = ret._id;
		delete ret._id;
	},
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;