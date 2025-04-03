const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  billingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    address2: { type: String },
    apartment: { type: String }, // Additional field for apartment or suite
    country: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    shippingSame: { type: Boolean, default: false }
  },
  paymentInfo: {
    paymentMethod: { 
      type: String, 
      enum: ['Credit card', 'Debit card', 'Paypal'], 
      default: 'Credit card' 
    },
    cardName: { type: String }, // Name on card
    cardNumber: { type: String },
    expiryDate: { type: String },
    cvv: { type: String }
  },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
