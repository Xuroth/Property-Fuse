const mongoose	= require('mongoose');
const Schema		= mongoose.Schema;

const schema = new Schema({
	description: {
		type: String,
		required: true
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	status: {
		type: String,
		enum: ['removed', 'published', 'pending'],
		default: 'pending'
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	removedAt: {
		type: Date,
		default: null
	},
	updatedAt: {
		type: Date,
		default: null
	},
	updatedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		default: null
	}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Testimonial', schema);