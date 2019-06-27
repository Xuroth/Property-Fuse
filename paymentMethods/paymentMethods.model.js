const mongoose	= require('mongoose');
const Schema		= mongoose.Schema;

const schema = new Schema({
	sourceType: {
		type: String,
		enum: [
			'ach_credit_transfer',
			'ach_debit',
			'alipay',
			'bancontact',
			'card',
			'card_present',
			'eps',
			'giropay',
			'ideal',
			'multibanco',
			'p24',
			'sepa_debit',
			'sofort',
			'three_d_secure',
			'wechat'
		]
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	card: {
		brand: {
			type: String
		},
		fundType: {
			type: String,
			enum: [
				'credit',
				'debit',
				'prepaid',
				'unknown'
			]
		},
		last4: {
			type: String
		},
		dynamicLast4: {
			type: String,
			default: null
		},
		expMonth: {
			type: String,
			default: '0000'
		},
		expYear: {
			type: String
		}
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	updatedAt: {
		type: Date,
		default: null
	},
	sourceID: {
		type: String
	}
})

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('PaymentMethod', schema);