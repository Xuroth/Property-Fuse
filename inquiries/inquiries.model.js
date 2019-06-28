const mongoose	= require('mongoose');
const Schema		= mongoose.Schema;

const schema = new Schema({
	inquirer: {
		type: mongoose.Types.ObjectId,
		ref: 'User'
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	message: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: ['unread', 'read', 'deleted'],
		default: 'unread'
	},
	updatedAt: {
		type: Date,
		default: null
	},
	listing: {
		type: mongoose.Types.ObjectId,
		ref: 'Listing'
	}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Inquiry', schema);