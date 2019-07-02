const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcrypt-nodejs');
const db        = require('_helpers/db');
const stripe		= require('stripe')(process.env.STRIPE_SECRET_KEY);
const User      = db.User;
const Google		= require('googleapis');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
		update,
		changePassword,
		authFacebook,
		authGoogle,
		delete: _delete
};

async function authenticate({email, password}) {
    const user = await User.findOne({email});
    if (user && bcrypt.compareSync(password, user.password)) {
        const {password, ...userWithoutPassword} = user.toObject(); //TODO: Edit ..userWithoutPassword to be fields minus password
        const token = jwt.sign({ sub: user.id}, process.env.SECRET_KEY);
				userWithoutPassword.customerData = await stripe.customers.retrieve(user.customerKey);
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

		user.avatar = `https://placehold.it/400/${Math.floor(Math.random()*15790320).toString(16)}/ffffff/?text=${user.firstName[0]+user.lastName[0]}`;

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

async function changePassword(userID, userData){
	const user = await User.findById(userID);
	if(user && bcrypt.compareSync(userData.oldPassword, user.password)) {
		const {password, ...userWithoutPassword} = user.toObject();
		user.password = bcrypt.hashSync(userData.newPassword, bcrypt.genSaltSync(10));
		await user.save();

		//Regenerate new token
		const token = jwt.sign({sub: user.id}, process.env.SECRET_KEY);
		userWithoutPassword.customerData = await stripe.customers.retrieve(user.customerKey);
		return {
			...userWithoutPassword,
			token
		}
	}

}

async function _delete(id) {
		const user = await User.findById(id);
		await stripe.customers.del(user.customerKey);
    await User.findByIdAndRemove(id);
}

async function authGoogle(googleResponse){

	const google = {
		accessToken: '',
		refreshToken: '',
		userID: ''
	}
	//code
	const OAuth = new Google.google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		process.env.GOOGLE_URI_REDIRECT,
	)
	
	const {tokens} = await OAuth.getToken(googleResponse);
	OAuth.setCredentials(tokens);
	if(tokens.refresh_token){
		google.refreshToken = tokens.refresh_token;
	}
	google.accessToken = tokens.access_token;

	console.log(google)

	var googleOAuth = Google.google.oauth2({
		auth: OAuth,
		version: 'v2'
	});
	const OAuthUser = await googleOAuth.userinfo.get()
	//Check oauthuser status === 200 or statusText === 'OK'
	google.userID = OAuthUser.data.id;
	//Check if user email present
	const user = await User.findOne({email: OAuthUser.data.email});

	if(user){
		if(user.auth.google.refreshToken !== ''){
			google.refreshToken = user.auth.google.refreshToken;
		}
		user.auth.google = google;
		user.markModified('auth.google');

		const {password, ...userWithoutPassword} = user.toObject();
		
		user.customerData = await stripe.customers.retrieve(user.customerKey);

		
		await user.save();

		const token = jwt.sign({sub: user.id}, process.env.SECRET_KEY);

		return {
			...userWithoutPassword,
			token
		}
	}

	const newUser = new User({
		email: (OAuthUser.data.email ? OAuthUser.data.email : null),
		firstName: (OAuthUser.data.given_name ? OAuthUser.data.given_name : ''),
		lastName: (OAuthUser.data.family_name ? OAuthUser.data.family_name : ''),
		auth: {
			google: google
		},
		accountType: 'buyer'
	})

	const customerData = await stripe.customers.create({
		description: 'Google Auth',
		name: `${newUser.firstName} ${newUser.lastName}`,
		email: newUser.email
	});

	newUser.customerKey = customerData.id;

	newUser.avatar = `https://placehold.it/400/${Math.floor(Math.random()*15790320).toString(16)}/ffffff/?text=${newUser.firstName[0]+newUser.lastName[0]}`;
	
	await newUser.save()

	const {password, ...userWithoutPassword} = newUser.toObject();
	userWithoutPassword.customerData = await stripe.customers.retrieve(customerData.id);

	const token = jwt.sign({sub: newUser.id}, process.env.SECRET_KEY);

	return {
		...userWithoutPassword,
		token
	}
}

async function authFacebook(facebookResponse) {
	const user = await User.findOne({
		$or:[
			{'email': (facebookResponse.email?facebookResponse.email:'112233')},
			{$and: [
				{'firstName': (facebookResponse.first_name?facebookResponse.first_name:'======')},
				{'lastName': (facebookResponse.last_name?facebookResponse.last_name:'=====')}
			]}
		]
	});

	if(user){
		user.auth.facebook = {
			userID: facebookResponse.userID,
			accessToken: facebookResponse.accessToken
		}
		user.markModified('auth.facebook');
		await user.save();

		const token = jwt.sign({sub: user.id}, process.env.SECRET_KEY);
		const {password, ...userWithoutPassword} = user.toObject();
		userWithoutPassword.customerData = await stripe.customers.retrieve(user.customerKey);

		return {
			...userWithoutPassword,
			token
		};
	}

	const newUser = new User({
		email: (facebookResponse.email?facebookResponse.email:null),
		firstName: (facebookResponse.first_name?facebookResponse.first_name:null),
		lastName: (facebookResponse.last_name?facebookResponse.last_name:null),
		auth: {
			facebook: {
				userID: facebookResponse.userID,
				accessToken: facebookResponse.accessToken
			}
		},
		accountType: 'buyer'
	});

	const customerData = await stripe.customers.create({
		description: 'Facebook Auth',
		name: `${newUser.firstName} ${newUser.lastName}`,
		email: newUser.email
	});

	newUser.customerKey = customerData.id;

	newUser.avatar = `https://placehold.it/400/${Math.floor(Math.random()*15790320).toString(16)}/ffffff/?text=${newUser.firstName[0]+newUser.lastName[0]}`;

	await newUser.save()

	//Create JWT and sign for auto-login
	const {password, ...userWithoutPassword} = newUser.toObject();
	userWithoutPassword.customerData = await stripe.customers.retrieve(customerData.id);
	const token = jwt.sign({sub: newUser.id}, process.env.SECRET_KEY);
	return {
		...userWithoutPassword,
		token
	}
}