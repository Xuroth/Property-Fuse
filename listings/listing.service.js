const db        = require('_helpers/db');
const Listing   = db.Listing;

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

async function publish(id) {
	const listing = Listing.findById(id);
	listing.published = 'published';
	await listing.save();
	return listing;
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