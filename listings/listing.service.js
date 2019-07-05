const db        = require('_helpers/db');
const Listing   = db.Listing;
const User			= db.User;
const stripe		= require('stripe')(process.env.STRIPE_SECRET_KEY);
const fetch			= require('node-fetch');

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
		getRecentlySold,
		getListingsSearch
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

async function getListingsSearch(searchQuery) {
	switch(searchQuery.type) {
		case 'nearby': {
			const {radius, units, origin} = searchQuery;
			let queryResults = [
				origin,
			];
			let apiData = []
			await fetch(`https://zipcodedownload.com:5430/Radius?firstzipcode=${origin}&radiuscoverage=${radius}&format=json&key=${process.env.ZIP_API_KEY}`)
			.then( res => {
				if(res.status === 200) {
					return res.json()
				} else {
					throw 'ERROR'
				}
			})
			.then( (data) => {
				let zips = data.map( result => result.ZipCode);
				apiData = data;
				queryResults = queryResults.concat(zips);
				// console.log(queryResults)
			})

			let listingResults = await Listing.find({zipCode: {$in: queryResults}}).populate('createdBy', 'firstName lastName companyName email avatar')
			// console.log(apiData)
			await listingResults.forEach((listing,index) => {
				
				let distance = apiData.filter((apiEntry) => {
					// console.log('APIENTRY', apiEntry)
					return apiEntry.ZipCode === listing.zipCode;
				});
				if(distance.length < 1) {
					distance = Math.random().toFixed(2)
				} else {
					distance = distance[0].Distance
				}
				listingResults[index].distance = distance
			})
			return listingResults;
		}
	}

}