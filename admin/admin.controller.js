const express				= require('express');
const router				= express.Router();
const adminService	= require('./admin.service');

router.get('/dashboard', dashboard);

module.exports = router;

function dashboard(req, res, next) {
	adminService.getDashboardData()
		.then( data => data ? res.json(data) : res.status(400).json({message: 'Error Occurred'}))
		.catch( err => next(err));
}