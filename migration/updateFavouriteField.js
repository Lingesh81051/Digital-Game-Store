// migration/updateFavouriteField.js
const mongoose = require('mongoose');
const User = require('../backend/models/User'); // adjust path if necessary

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
    // Find documents that still contain the old field "favouriteColor"
    const users = await User.find({ favouriteColor: { $exists: true } });
    console.log(`Found ${users.length} users to update.`);
    for (const user of users) {
      if (user.favouriteColor) {
        // Copy the value of favouriteColor to favouritePlace
        user.favouritePlace = user.favouriteColor;
        // Optionally, remove the old field
        user.favouriteColor = undefined;
        await user.save();
        console.log(`Updated user: ${user._id}`);
      }
    }
    console.log('Migration complete.');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    mongoose.connection.close();
  }
}
