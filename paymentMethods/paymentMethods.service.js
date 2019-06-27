const stripe 					= require('stripe')(process.env.STRIPE_SECRET_KEY);
const db							=	require('_helpers/db');
const PaymentMethods	= db.PaymentMethod;
const Users						= db.User;

module.exports = {
	getPaymentMethods,
	attachSource
}

async function getPaymentMethods(userID) {
	const paymentMethods = await PaymentMethods.find({owner: userID});
	return paymentMethods;
}

async function attachSource(userID, source) {
	const user = await Users.findById(userID);
	if(!user){
		throw 'No User to attach!';
	}

	await stripe.customers.createSource(user.customerKey, {source: source.id})
		.catch( error => {
			throw error
		});
		const newSource = new PaymentMethods();
		if(source.card) {
			newSource.type = 'card';
			newSource.card.brand = source.card.brand;
			newSource.card.fundType = source.card.funding;
			if(source.card.dynamic_last4){
				newSource.card.dynamicLast4 = source.card.dynamic_last4;
			}
			if(source.card.last4){
				newSource.card.last4 = source.card.last4;
			}
			newSource.card.expMonth = source.card.exp_month;
			newSource.card.expYear = source.card.exp_year;
		}

		newSource.owner = userID;
		newSource.sourceID = source.id;

		await newSource.save();

		const paymentMethods = await PaymentMethods.find({owner: userID});

		return paymentMethods;
}