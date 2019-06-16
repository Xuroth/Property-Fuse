const express				= require('express');
const router				= express.Router();
const adminService	= require('./admin.service');

router.get('/dashboard', dashboard);
router.get('/users', getAllUsers);
router.put('/users/:id/edit', editUserData);
router.put('/users/:id/reset', resetUserPassword);
router.put('/users/:id/lock', lockUser);
router.put('/users/:id/unlock', unlockUser);
module.exports = router;

function dashboard(req, res, next) {
	adminService.getDashboardData()
		.then( data => data ? res.json(data) : res.status(400).json({message: 'Error Occurred'}))
		.catch( err => next(err));
}

function lockUser(req, res, next) {
	adminService.lockUser(req.params.id, req.user._id)
		.then( data => data ? res.json(data) : res.status(400).json({message: 'Error Occurred while locking user.'}))
		.catch( err => next(err));
}

function unlockUser(req, res, next) {
	adminService.unlockUser(req.params.id, req.user._id)
		.then( data => data ? res.json(data) : res.status(400).json({message: 'Error Occurred while locking user.'}))
		.catch( err => next(err));
}

function resetUserPassword(req, res, next) {
	adminService.resetUserPassword(req.params.id, req.user._id)
		.then( user => user ? res.json(user) : res.status(404).send({message: 'No such user.'}))
		.catch( err => next(err))
}

function getAllUsers(req, res, next) {
	adminService.getAllUsers()
		.then( users => users ? res.json(users) : res.status(404).send({message: 'No Users'}))
		.catch( err => next(err));
}

function editUserData(req, res, next) {
	adminService.editUser(req.params.id, req.user._id, req.body.user)
		.then( user => user ? res.json(user) : res.status(400).send({message: 'Invalid Operation'}))
		.catch( err => next(err));
}