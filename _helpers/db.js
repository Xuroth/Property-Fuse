const mongoose = require('mongoose');

//Initialize MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {useCreateIndex: true, useNewUrlParser: true});

//Configure Mongoose to use the standard built-in Promise library
mongoose.Promise = global.Promise;

//Connect all models for use
module.exports = {
    User: require('../users/user.model'),
		Listing: require('../listings/listing.model'),
		Testimonial: require('../testimonials/testimonial.model'),
		PaymentMethod: require('../paymentMethods/paymentMethods.model'),
		Inquiry: require('../inquiries/inquiries.model')
};