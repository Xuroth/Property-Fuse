const express							= require('express');
const router							= express.Router();
const testimonialService	= require('./testimonial.service');

router.post('/create', create);
router.get('/', getAll);
router.get('/:id', getByID)
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function create(req, res, next) {
	testimonialService.create(req.user, req.body)
		.then( () => res.json({}) )
		.catch( err => next(err) );
}

function getAll(req, res, next) {
	testimonialService.getAll()
		.then( testimonials => res.json(testimonials) )
		.catch( err => next(err) );
}

function getByID(req, res, next) {
	testimonialService.getById(req.params.id)
		.then( testimonial => testimonial ? res.json(testimonial) : res.sendStatus(404) )
		.catch( err => next(err) );
}

function update(req, res, next) {
	testimonialService.update(req.params.id, req.user, req.body)
		.then( () => res.json({}) )
		.catch( err => next(err) );
}

function _delete(req, res, next) {
	testimonialService.delete(req.params.id)
		.then( () => res.json({}) )
		.catch( err => next(err) );
}