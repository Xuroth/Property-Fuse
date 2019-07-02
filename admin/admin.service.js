const db					= require('_helpers/db');
const User				= db.User;
const Testimonial = db.Testimonial;
const Listing			= db.Listing;
const Inquiry			= db.Inquiry;

module.exports = {
	getDashboardData,
	lockUser,
	unlockUser,
	resetUserPassword,
	getAllUsers,
	editUser,
	getPendingTestimonials,
	publishTestimonial,
	rejectTestimonial
}

async function getDashboardData() {
	return {
		usersCount: await User.countDocuments(),
		listingsCount: await Listing.countDocuments(),
		testimonialsCount: await Testimonial.countDocuments(),
		inquiriesCount: await Inquiry.countDocuments(),
		mostRecentListing: await Listing.findOne({status: 'published'}).sort({createdAt: -1}).populate('createdBy', 'firstName lastName email accountType companyName avatar id'),
		mostRecentSoldListing: await Listing.findOne({status: 'sold'}).sort({updatedAt: -1}).populate('createdBy', 'firstName lastName email accountType companyName avatar id')
	}
}

async function lockUser(id, admin) {
	const user = await User.findById(id);
	if(!user) throw 'User not found';
	let updatedData = {
		status: 'locked',
		updatedBy: admin,
		updatedAt: Date.now()
	}
	Object.assign(user, updatedData);
	await user.save();
	return user;
}

async function unlockUser(id, admin) {
	const user = await User.findById(id);
	if(!user) throw 'User not found';
	let updatedData = {
		status: 'unlocked',
		updatedBy: admin,
		updatedAt: Date.now()
	}
	Object.assign(user, updatedData);
	await user.save();
	return user;
}

async function resetUserPassword(id, adminID) {
	const user = await User.findById(id);
	let updatedData = {
		status: 'locked',
		resetToken: '21098347ruo2j09',
		updatedBy: adminID,
		updatedAt: Date.now()
	}
	Object.assign(user, updatedData);
	await user.save();
	return user;
}

async function getAllUsers() {
	return await User.find();
}

async function editUser(id, adminID, userData) {
	const user = await User.findById(id);
	userData.updatedBy = adminID;
	userData.updatedOn = Date.now();

	Object.assign(user, userData);
	await user.save();
	return user;
}

async function getPendingTestimonials() {
	const testimonials = await Testimonial.find({status: 'pending'})
															.populate('updatedBy', '-password')
															.populate('author', '-password')
															.sort({updatedAt: 1, createdAt: 1})
	return testimonials;
}

async function publishTestimonial(id, adminID) {
	const testimonial = await Testimonial.findById(id);
	testimonial.updatedAt = Date.now();
	testimonial.updatedBy = adminID;
	testimonial.status = 'published';
	await testimonial.save()
	return testimonial;
}

async function rejectTestimonial(id, adminID) {
	console.log(adminID)
	const testimonial = await Testimonial.findById(id);
	testimonial.updatedAt = Date.now();
	testimonial.updatedBy = adminID;
	testimonial.status = 'removed';
	testimonial.removedAt = Date.now();
	await testimonial.save()
	return testimonial;
}