const express					= require('express');
const router					= express.Router();
const inquiryService	= require('./inquiries.service');

//Inquiry Routes
router.get('/', getInquiriesByUser);
router.get('/listing/:id', getInquiriesByListing);
router.get('/:id', getInquiryById);
router.post('/', createNewInquiry);
router.put('/:id', markInquiryRead);
router.post('/:id', markInquiryUnread);
router.delete('/:id', markInquiryDeleted);

module.exports = router;

function getInquiriesByUser(req, res, next) {
	inquiryService.getAllInquiriesForUser(req.user.sub)
		.then( inquiries => inquiries ? res.json(inquiries) : res.status(404).json({message: 'No user found for inquiries'}))
		.catch( err => next(err) );
}

function getInquiriesByListing(req, res, next) {
	inquiryService.getAllInquiriesForListing(req.params.id, req.user.sub)
		.then( inquiries => inquiries ? res.json(inquiries) : res.status(404).json({message: 'No Listing found for inquiries'}) )
		.catch( err => next(err) );
}

function getInquiryById(req, res, next) {
	inquiryService.getById(req.params.id)
		.then( inquiry => inquiry ? res.json(inquiry) : res.status(404).json({message: 'Error looking for inquiry'}) )
		.catch( err => next(err) );
}

function createNewInquiry(req, res, next) {
	console.log(req.body)
	inquiryService.newInquiry(req.body.inquiry, req.user.sub, req.body.listing)
		.then( inquiry => inquiry ? res.json(inquiry) : res.status(500).json({message: 'Error posting inquiry. Please try again.'}) )
		.catch( err => next(err) );
}

function markInquiryRead(req, res, next) {
	inquiryService.markReadInquiry(req.params.id)
		.then( inquiry => inquiry ? res.json(inquiry) : res.status(404).json({message: 'Error updating inquiry'}) )
		.catch( err => next(err) );
}

function markInquiryDeleted(req, res, next) {
	inquiryService.markDeletedInquiry(req.params.id)
		.then( inquiry => inquiry ? res.json(inquiry) : res.status(404).json({message: 'Error updating inquiry'}) )
		.catch( err => next(err) );
}

function markInquiryUnread(req, res, next) {
	inquiryService.markUnreadInquiry(req.params.id)
		.then( inquiry => inquiry ? res.json(inquiry) : res.status(404).json({message: 'Error finding inquiry'}) )
		.catch( err => next(err) );
}