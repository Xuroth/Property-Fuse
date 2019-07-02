const db				=	require('_helpers/db');
const Inquiries = db.Inquiry;
const Listings	= db.Listing;
const Users			= db.User;

module.exports = {
	getAllInquiriesForListing,
	getAllInquiriesForUser,
	getAllInquiriesForFromListings,
	getById,
	newInquiry,
	markReadInquiry,
	markDeletedInquiry,
	markUnreadInquiry
}

async function getAllInquiriesForListing(listingID, userID){
	//Set consts for reference and authorization check
	const user = await Users.findById(userID);
	const listing = await Listings.findById(listingID);

	if(listing && (user.accountType === 'admin' || userID === listing._id.toSting())){
		const inquiries = await Inquiries.find({listing: listing._id, status: {$ne: 'deleted'}  }).populate('inquirer', 'firstName lastName companyName email avatar');
		return inquiries;
	} else if(listing) {
		throw 'Not Authorized';
	} else {
		throw 'No Listing';
	}
}

async function getAllInquiriesForUser(userID) {
	const inquiries = await Inquiries.find({inquirer: userID})
		.populate('listing', 'address1 address2 city state zipCode');
	if(!inquiries) {
		throw 'Invalid Request';
	} else {
		return inquiries;
	}
}

async function getAllInquiriesForFromListings(userID) {
	const listings = await Listings.find({createdBy: userID}).select('_id');
	const inquiries = await Inquiries.find({listing: {$in: listings}})
		.populate('inquirer', 'firstName lastName companyName email avatar')
		.populate('listing', 'address1 address2 city state zipCode askPrice createdAt images');

	return inquiries;
}

async function getById(inquiryID) {
	const inquiry = await Inquiries.findById(inquiryID)
		.populate('listing', 'address1 address2 city state zipCode askPrice createdAt images status')
		.populate('inquirer', 'firstName lastName companyName email avatar');
	if(!inquiry){
		throw 'Invalid Request';
	} else {
		return inquiry
	}
}

async function newInquiry(inquiryData, userID, listingID) {
	console.log(inquiryData)
	const listing = await Listings.findById(listingID);
	if(!listing){
		throw 'Invalid Request';
	}
	const newInquiry = new Inquiries(inquiryData);
	newInquiry.inquirer = userID;
	newInquiry.listing = listingID;
	await newInquiry.save();
	return newInquiry;
}

async function markReadInquiry(inquiryID) {
	const inquiry = await Inquiries.findById(inquiryID)
		.populate('listing', 'address1 address2 city state zipCode askPrice createdAt images status')
		.populate('inquirer', 'firstName lastName companyName email avatar');
	inquiry.status = 'read';
	inquiry.updatedAt = Date.now();
	await inquiry.save();
	return inquiry;
}

async function markDeletedInquiry(inquiryID) {
	const inquiry = await Inquiries.findById(inquiryID)
		.populate('listing', 'address1 address2 city state zipCode askPrice createdAt images status')
		.populate('inquirer', 'firstName lastName companyName email avatar');
	inquiry.status = 'deleted';
	inquiry.updatedAt = Date.now();
	await inquiry.save();
	return inquiry;
}

async function markUnreadInquiry(inquiryID) {
	const inquiry = await Inquiries.findById(inquiryID)
		.populate('listing', 'address1 address2 city state zipCode askPrice createdAt images status')
		.populate('inquirer', 'firstName lastName companyName email avatar');
	inquiry.status = 'unread';
	inquiry.updatedAt = Date.now();
	await inquiry.save();
	return inquiry;
}