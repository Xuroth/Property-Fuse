const express           = require('express');
const router            = express.Router();
const listingService    = require('./listing.service');

//Listing Routes
router.post('/create', create);
router.get('/', getAll);
router.get('/featured', featured);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);


module.exports = router;

function create(req, res, next) {
    //console.log('Controller')
    //console.log('REQ.USER;',req.user)
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

function update(req, res, next) {
    listingService.update(req.params.id, req.body)
        .then( () => res.json({}) )
        .catch( err => next(err) );
}

function _delete(req, res, next) {
    listingService.delete(req.params.id)
        .then( () => res.json({}) )
        .catch( err => next(err) );
}

function featured(req, res, next) {
    listingService.getFeatured()
        .then( (listings) => res.json(listings) )
        .catch( err => next(err) );
}