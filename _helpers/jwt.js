const expressJwt    = require('express-jwt');
const userService   = require('../users/user.service');
const JWT						= require('jsonwebtoken');

module.exports = jwt;

function jwt() {
    const secret = process.env.SECRET_KEY;
    return expressJwt({secret, isRevoked}).unless({
        path: [
						//Public routes
						{
							url: '/users/auth/google',
							methods: ['POST']
						},
						{
							url: '/users/auth/facebook',
							methods: ['POST']
						},
						{
							url: '/users/authenticate',
							methods: ['POST']
						},
						{
							url: '/users/register',
							methods: ['POST']
						},
						{
							url: '/listings',
							methods: ['GET']
						},
						{
							url: '/listings/featured',
							methods: ['GET']
						},
						{
							url: '/listings/sold',
							methods: ['GET']
						},
						{
							url: '/listings/recently-sold',
							methods: ['GET']
						},
						
						{
							url: /^\/listings\/.*/,
							methods: ['GET']
						},
						{
							url: '/testimonials',
							methods: ['GET']
						},
				],
				//custom: looseAuthMiddleware
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);
		
    //Revoke token if no longer exists
    if(!user) {
        return done(null, true);
		}
    done();
}
//TODO: Admin verification functions

const looseAuthMiddleware = (req) => {
	const token = req.headers.authorization;
	if(token) {
		JWT.verify(token, process.env.SECRET_KEY, function(err, decoded) {
			return true;
		})
	} else {
		return true;
	}
}