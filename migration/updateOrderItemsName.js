// to run use this command: node migration/updateOrderItemsName.js

// migration/updateOrderItemsName.js

const mongoose = require('mongoose');
const Order = require('../backend/models/Order');
const Product = require('../backend/models/Product'); // Ensure this path is correct

// Connect to your MongoDB database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  runMigration();
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

async function runMigration() {
  try {
    // Find all orders
    const orders = await Order.find({});
    for (const order of orders) {
      let updated = false;
      // Iterate through orderItems
      for (const item of order.orderItems) {
        // If the name field is missing or empty, fetch it from the Product model
        if (!item.name || item.name.trim() === '') {
          const product = await Product.findById(item.product);
          if (product) {
            item.name = product.name;
            updated = true;
          } else {
            console.log(`Product not found for order ${order._id} item: ${item.product}`);
          }
        }
      }
      // Save the order only if it was updated
      if (updated) {
        await order.save();
        console.log(`Updated order: ${order._id}`);
      }
    }
    console.log('Migration complete.');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    mongoose.connection.close();
  }
}
