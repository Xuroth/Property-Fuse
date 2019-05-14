const db        = require('_helpers/db');
const Listing   = db.Listing;

module.exports = {
    getAll,
    getById,
    create,
    update,
    getFeatured,
    delete: _delete
};

async function getAll() {
    return await Listing.find();
}

async function getById(id) {
    return await Listing.findById(id);
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
}

async function getFeatured() {
    return await Listing.find({featured: true});
}
async function _delete(id) {
    await Listing.findByIdAndRemove(id);
}

