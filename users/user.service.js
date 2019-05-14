const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcrypt-nodejs');
const db        = require('_helpers/db');
const User      = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({email, password}) {
    const user = await User.findOne({email});
    console.log('user', user, 'email/pass', email, password)
    if (user && bcrypt.compareSync(password, user.password)) {
        console.log('here')
        const {password, ...userWithoutPassword} = user.toObject(); //TODO: Edit ..userWithoutPassword to be fields minus password
        const token = jwt.sign({ sub: user.id}, process.env.SECRET_KEY);
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-password');
}

async function getById(id) {
    return await User.findById(id).select('-password');
}

async function create(userParameters) {
    if (await User.findOne({ email: userParameters.email })) {
        throw 'Email address "' + userParameters.email + '" already registered.';
    }

    const user = new User(userParameters);
    if(!userParameters.accountType){
        user.accountType = 'buyer';
    }
    if (userParameters.password) {
        user.password = bcrypt.hashSync(userParameters.password, bcrypt.genSaltSync(10));
    }

    await user.save();
}

async function update(id, userParameters) {
    const user = await User.findById(id);
    
    if (!user) throw 'User not found';
    if (user.email !== userParameters.email && await User.findOne({ email: userParameters.email})) {
        throw 'Email address "' + userParameters.email + '" is already registered.';
    }

    if (userParameters.password){
        userParameters.password = bcrypt.hashSync(userParameters.password, bcrypt.genSaltSync(10));
    }

    Object.assign(user, userParameters);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

