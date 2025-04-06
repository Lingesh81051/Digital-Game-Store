// backend/models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true }, // New field to store product name
  quantity: { type: Number, required: true }
});

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderItems: [orderItemSchema],
    billingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      username: { type: String, required: true },
      address: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentInfo: {
      cardName: { type: String, required: true },
      cardNumber: { type: String, required: true },
      expiryDate: { type: String, required: true },
      cvv: { type: String, required: true }
    },
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
