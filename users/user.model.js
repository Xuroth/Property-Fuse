const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const schema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    accountType: {
        type: String,
        enum: ['buyer','seller','admin'],
        required: true
		},
		resetToken: {
			type: String,
			default: null
		},
		verified: {
			type: Boolean,
			default: false
		},
		status: {
			type: String,
			enum: ['pending', 'locked', 'status', 'unlocked', 'banned'],
			default: 'unlocked'
		},
		companyName: {
			type: String,
			default: null
		},
		avatar: {
			type: String,
			default: 'https://placehold.it/300&text=No%20Image'
		},
		updatedAt: {
			type: Date,
			default: null
		},
		updatedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('User', schema);