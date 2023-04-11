const mongoose = require('mongoose');

const figureSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	character: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Character'
	},
	image: {
		data: Buffer,
		contentType: String,
	},
	description: String,
	manufacturer: {
		type: String,
		required: true
	},
	material: {
		type: String,
		required: true
	},
	quantity: { type: Number, default: 1 },
	price: { type: Number, required: true },
	//listedBy:
	added: mongoose.Schema.Types.Date,
	modified: mongoose.Schema.Types.Date
})

figureSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) {
		// Remove the _id field and add an id field with the same value
		ret.id = ret._id;
		delete ret._id;
	},
});

const Figure = mongoose.model('Figure', figureSchema);

module.exports = Figure;