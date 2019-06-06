const db					= require('_helpers/db');
const User				= db.User;
const Testimonial = db.Testimonial;
const Listing			= db.Listing;

module.exports = {
	getDashboardData
}

async function getDashboardData() {
	return {
		usersCount: await User.countDocuments(),
		listingsCount: await Listing.countDocuments(),
		testimonialsCount: await Testimonial.countDocuments(),
		inquiriesCount: 2
	}
}