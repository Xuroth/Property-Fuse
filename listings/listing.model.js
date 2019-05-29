const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const schema = new Schema({
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        default: null
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'sold', 'published', 'removed', 'deleted'],
        default: 'pending',
        required: true
    },
    askPrice: {
        type: Number, //tracked in cents
        required: true,
        default: 0,
        get: getPrice,
        set: setPrice
		},
		soldPrice: {
			type: Number,
			default: 0,
			get: getPrice,
			set: setPrice
		},
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
		},
		removedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
    removedAt: {
        type: Date,
        default: null
		},
		updatedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
    updatedAt: {
        type: Date,
        default: null
    },
    description: {
        type: String,
        required: true
    },
    amenities: {
        bedrooms: {
            type: Number,
            default: 0
        },
        bathrooms: {
            type: Number,
            default: 0
        },
        halfBathrooms: {
            type: Number,
            default: 0
        },
        vacant: {
            type: Boolean,
            default: true
        },
        yearBuilt: {
            type: String,
            default: null
        },
        condition: {
            type: Number,
            default: 1
        },
        garage: {
            type: Number,
            default: 0
        },
        sqFt: {
            type: Number,
            default: 0
        }
    },
    propertyType: {
        type: String,
        enum: [
            'single',
            'duplex',
            'triplex',
            'quadplex',
            'multiFamily',
            'commercial',
            'land',
            'townhome',
            'condo',
            'patio',
            'mobile',
            'other'
        ]
    },
    arv: {
        estimate: {
            type: Number,
            required: true,
            get: getPrice,
            set: setPrice
        },
        explanation: {
            type: String,
            required: true
        }
    },
    repairs: {
        estimate: {
            type: Number,
            required: true,
            get: getPrice,
            set: setPrice
        },
        explanation: {
            type: String,
            required: true
        }
    },
    featured: {
        type: Boolean,
        default: false
		},
		promoted: {
			type: Boolean,
			default: false
		},
		images: [
			{
				url: {
					type: String,
					default: 'http://placehold.it/800&text=Property%20Image'
				},
				main: {
					type: Boolean,
					default: false
				}
			}
		]
});


function getPrice(num){
    return (num / 100).toFixed(2);
}
function setPrice(num) {
    return num * 100;
}

schema.set('toJSON', {virtuals: true, getters: true});

module.exports = mongoose.model('Listing', schema);