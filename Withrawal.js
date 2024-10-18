const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WithdrawalSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'upi', 'bank', 'usdt'], // allowed values for payment method
        required: true
    },
    cashDetails: {
        name: {
            type: String,
            required: function () { return this.paymentMethod === 'cash'; }
        },
        mobile: {
            type: String,
            required: function () { return this.paymentMethod === 'cash'; }
        }
    },
    upiDetails: {
        upiId: {
            type: String,
            required: function () { return this.paymentMethod === 'upi'; }
        }
    },
    bankDetails: {
        account: {
            type: String,
            required: function () { return this.paymentMethod === 'bank'; }
        },
        bankName: {
            type: String,
            required: function () { return this.paymentMethod === 'bank'; }
        },
        holderName: {
            type: String,
            required: function () { return this.paymentMethod === 'bank'; }
        },
        ifsc: {
            type: String,
            required: function () { return this.paymentMethod === 'bank'; }
        }
    },
    usdtDetails: {
        walletAddress: {
            type: String,
            required: function () { return this.paymentMethod === 'usdt'; }
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // reference to the User model
        ref: 'User',  // This must be the correct model name
        required: true
    }
,    
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Withdrawal = mongoose.model('Withdrawal', WithdrawalSchema); // 'Withdrawal' is the name of the collection
module.exports = Withdrawal;
