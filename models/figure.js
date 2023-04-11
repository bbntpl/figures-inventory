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
	added: {
		type: mongoose.Schema.Types.Date,
		default: Date.now // Set the default value to the current date and time
	},
	modified: {
		type: mongoose.Schema.Types.Date,
		default: Date.now // Set the default value to the current date and time
	},
})

const conversionObject = {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) {
		// Remove the _id field and add an id field with the same value
		ret.id = ret._id;
		delete ret._id;
	},
}

figureSchema.set('toJSON', conversionObject);
figureSchema.set('toObject', conversionObject);

const Figure = mongoose.model('Figure', figureSchema);

module.exports = Figure;