const express           = require('express');
const router            = express.Router();
const listingService    = require('./listing.service');

//Listing Routes
router.post('/create', create);
router.get('/', getAll);
router.get('/featured', getFeatured);
router.get('/sold', getSold);
router.get('/recently-sold', getRecentlySold);
router.get('/by/:id', getByCreatorId)
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
router.post('/publish', publish);
router.post('/promote/:id', promote);

module.exports = router;

function create(req, res, next) {
	listingService.create(req.user, req.body)
		.then(  () => res.json({}) )
		.catch( err => next(err) );
}

function getAll(req, res, next) {
	listingService.getAll()
		.then( listings => res.json(listings) )
		.catch( err => next(err) );
}

function getById(req, res, next) {
	listingService.getById(req.params.id)
		.then( listing => listing ? res.json(listing) : res.sendStatus(404) )
		.catch( err => next(err) );
}

function getByCreatorId(req, res, next) {
	listingService.getByCreatorId(req.params.id)
		.then( listings => listings ? res.json(listings) : res.sendStatus(404) )
		.catch( err => next(err) );
}

function update(req, res, next) {
	listingService.update(req.params.id, req.body)
		.catch( err => next(err) )
		.then( (listing) => res.json(listing) )
}

function _delete(req, res, next) {
	listingService.delete(req.params.id)
		.then( () => res.json({}) )
		.catch( err => next(err) );
}

function getFeatured(req, res, next) {
	listingService.getFeatured()
		.then( (listings) => res.json(listings) )
		.catch( err => next(err) );
}

function publish(req, res, next) {
	listingService.publish(req.user.sub, req.body.listing, req.body.source.source)
		.then( (listing) => listing ? res.json(listing) : res.status(400).json({message: 'There was a problem with your request. Please try again.'}))
		.catch( err => next(err) );
}

function promote(req, res, next) {
	listingService.promote(req.params.id)
		.then( listing => res.json({listing}) )
		.catch( err => next(err) )
}

function getSold(req, res, next) {
	listingService.getSold()
		.then( (listings) => res.json({listings}) )
		.catch( err => next(err) );
}

function getRecentlySold(req, res, next) {
	listingService.getRecentlySold()
		.then( (listings) => res.json(listings) )
		.catch( err => next(err) );
}