const db					= require('_helpers/db');
const User				= db.User;
const Testimonial = db.Testimonial;
const Listing			= db.Listing;

module.exports = {
	getDashboardData,
	lockUser,
	unlockUser,
	resetUserPassword,
	getAllUsers,
	editUser
}

async function getDashboardData() {
	return {
		usersCount: await User.countDocuments(),
		listingsCount: await Listing.countDocuments(),
		testimonialsCount: await Testimonial.countDocuments(),
		inquiriesCount: 2
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