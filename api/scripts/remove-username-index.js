import { connectDB } from '../config/database.js';

async function removeUsernameIndex() {
  try {
    const db = await connectDB();
    console.log('Connected to database');
    
    // Get the users collection
    const usersCollection = db.collection('users');
    
    // List all indexes
    const indexes = await usersCollection.listIndexes().toArray();
    console.log('Current indexes:', indexes.map(idx => ({ name: idx.name, key: idx.key })));
    
    // Check if username index exists
    const usernameIndex = indexes.find(idx => idx.name === 'username_1');
    
    if (usernameIndex) {
      console.log('Found username index, removing...');
      await usersCollection.dropIndex('username_1');
      console.log('Successfully removed username index');
    } else {
      console.log('No username index found');
    }
    
    // List indexes again to confirm
    const updatedIndexes = await usersCollection.listIndexes().toArray();
    console.log('Updated indexes:', updatedIndexes.map(idx => ({ name: idx.name, key: idx.key })));
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

removeUsernameIndex();
