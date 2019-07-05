const express       = require('express');
const router        = express.Router();
const userService   = require('./user.service');

//User Routes
router.post('/authenticate', authenticate);
router.post('/auth/google', authGoogle);
router.post('/auth/facebook', authFacebook);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/change-password', changePassword);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

//Route function definitions
function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({message: 'Email or password is incorrect'}))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function changePassword(req, res, next) {
	userService.changePassword(req.user.sub, req.body)
		.then( user => user ? res.json(user) : res.status(400).json({message: 'Old password invalid.'}))
		.catch( err => next(err) );
}
function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function authGoogle(req, res, next) {
	userService.authGoogle(req.body)
		.then( user => user ? res.json(user) : res.status(400).json({message: 'Error occured during authorization process.'}))
		.catch( err => next(err) );
}

function authFacebook(req, res, next) {
	userService.authFacebook(req.body)
		.then( user => user ? res.json(user) : res.status(400).json({message: 'Error occured during authorization process.'}))
		.catch( err => next(err) );
}