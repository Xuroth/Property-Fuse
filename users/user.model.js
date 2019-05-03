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
    }
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('User', schema);