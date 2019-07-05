const express		= require('express');
const router		= express.Router();
const appService	= require('./app.service');

router.get('/key/:requestedKey', getKey);

module.exports = router;

function getKey(req, res, next) {
	appService.getKey(req.params.requestedKey)
		.then( key => key ? res.json(key) : res.status(404).json({message: 'Unknown key or error.'}))
		.catch( err => next(err) );
}