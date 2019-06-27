const express								= require('express');
const router								= express.Router();
const paymentMethodsService	= require('./paymentMethods.service');

router.get('/', getPaymentMethods);
router.put('/attach', attachSource);

module.exports = router;

function getPaymentMethods(req, res, next) {
	paymentMethodsService.getPaymentMethods(req.user.sub)
		.then(
			paymentMethods => paymentMethods ? res.json(paymentMethods) : res.status(404).json({message: 'Unable to get payment methods.'})
		)
		.catch( err => next(err));
}

function attachSource(req, res, next) {
	paymentMethodsService.attachSource(req.user.sub, req.body.source)
		.then( paymentMethods => paymentMethods ? res.json(paymentMethods) : res.status(400).json({message: 'Unable to add card to your profile.'}))
		.catch( err => next(err));
}