const db        = require('_helpers/db');
const Listing   = db.Listing;
const User			= db.User;
const stripe		= require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
    getAll,
		getById,
		getByCreatorId,
    create,
    update,
		getFeatured,
		publish,
		promote,
		delete: _delete,
		getSold,
		getRecentlySold
};

async function getAll() {
	return await Listing.find();
}

async function getById(id) {
	return await Listing.findById(id).populate('createdBy', '-password').populate('updatedBy', '-password').populate('removedBy', '-password');
}

async function getByCreatorId(id) {
	return await Listing.find({createdBy: id}).populate('createdBy', '-password').populate('upadatedBy', '-password').populate('removedBy', '-password');
}

async function create(user, listingParameters) {
	console.log('USER;',user)
	const listing = new Listing(listingParameters);
	
	listing.lister = user.sub;
	await listing.save();
}

async function update(id, listingParameters) {
	const listing = await Listing.findById(id);

	if(!listing) throw 'Listing not found';
	Object.assign(listing, listingParameters);

	await listing.save();
	return listing;
}

async function getFeatured() {
	return await Listing.find({featured: true});
}

async function _delete(id) {
	await Listing.findByIdAndRemove(id);
}

async function publish(userID, listing, source) {
	const newListing = new Listing(listing);
	const user = await User.findById(userID)
	newListing.status = 'pending';
	await stripe.charges.create({
		amount: 50000,
		currency: 'usd',
		description: `Listing fee for ${listing.address1} ${listing.address2} ${listing.city} ${listing.state} ${listing.zipCode}`,
		customer: user.customerKey,
		source: source.id
	})
	.then( (charge) => {
		// console.log('charge', charge)
		newListing.status = 'published';
	})
	await newListing.save();
	return newListing;

}

async function promote(id) {
	const listing = Listing.findById(id);
	listing.featured = true;
	await listing.save();
	return listing;
}

async function getSold() {
	return await Listing.find({status: 'sold'}).sort({'updatedAt': -1}).populate('createdBy', '-password').populate('updatedBy', '-password').populate('removedBy', '-password');
}

async function getRecentlySold() {
	return await Listing.find({status: 'sold'}).sort({'updatedAt': -1}).populate('createdBy', '-password').populate('updatedBy', '-password').populate('removedBy', '-password');
}