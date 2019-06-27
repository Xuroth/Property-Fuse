const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcrypt-nodejs');
const db        = require('_helpers/db');
const stripe		= require('stripe')(process.env.STRIPE_SECRET_KEY);
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
        const {password, ...userWithoutPassword} = user.toObject(); //TODO: Edit ..userWithoutPassword to be fields minus password
        const token = jwt.sign({ sub: user.id}, process.env.SECRET_KEY);
				userWithoutPassword.customerData = await stripe.customers.retrieve(user.customerKey)
				console.log(userWithoutPassword);
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
		
		let customerData = await stripe.customers.create({
			description: user.companyName,
			name: user.firstName+' '+user.lastName,
			email: user.email
		});

		user.customerKey = customerData.id;

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

		stripe.customers.update(
			user.customerKey,
			{
				email: user.email,
				name: user.firstName+' '+user.lastName,
				description: user.companyName
			}
		)
    await user.save();
}

async function _delete(id) {
		const user = await User.findById(id);
		await stripe.customers.del(user.customerKey);
    await User.findByIdAndRemove(id);
}