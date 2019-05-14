const expressJwt    = require('express-jwt');
const userService   = require('../users/user.service');

module.exports = jwt;

function jwt() {
    const secret = process.env.SECRET_KEY;
    return expressJwt({secret, isRevoked}).unless({
        path: [
            //Public routes
            '/users/authenticate',
            '/users/register',
            '/listings/'
        ]
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