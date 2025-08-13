const mongoose = require('mongoose');
require('dotenv').config();

async function cleanupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillplot', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Get the skills collection
    const db = mongoose.connection.db;
    const skillsCollection = db.collection('skills');
    
    // List all indexes
    console.log('\n📋 Current indexes:');
    const indexes = await skillsCollection.indexes();
    indexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Remove problematic indexes (if they exist)
    console.log('\n🧹 Cleaning up indexes...');
    
    try {
      await skillsCollection.dropIndex('user_1_name_1');
      console.log('✅ Removed user_1_name_1 index');
    } catch (err) {
      console.log('ℹ️  user_1_name_1 index not found or already removed');
    }
    
    try {
      await skillsCollection.dropIndex('userId_1_skill_1');
      console.log('✅ Removed userId_1_skill_1 index');
    } catch (err) {
      console.log('ℹ️  userId_1_skill_1 index not found or already removed');
    }
    
    // Clean up documents with null values
    console.log('\n🧹 Cleaning up documents with null values...');
    const deleteResult = await skillsCollection.deleteMany({
      $or: [
        { userId: null },
        { skill: null },
        { skill: '' }
      ]
    });
    console.log(`✅ Deleted ${deleteResult.deletedCount} invalid documents`);
    
    // Clean up duplicate skills per user
    console.log('\n🧹 Cleaning up duplicate skills...');
    const duplicates = await skillsCollection.aggregate([
      {
        $group: {
          _id: { userId: '$userId', skill: '$skill' },
          count: { $sum: 1 },
          docs: { $push: '$_id' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).toArray();
    
    let duplicateCount = 0;
    for (const duplicate of duplicates) {
      // Keep the first document, delete the rest
      const docsToDelete = duplicate.docs.slice(1);
      await skillsCollection.deleteMany({ _id: { $in: docsToDelete } });
      duplicateCount += docsToDelete.length;
    }
    console.log(`✅ Removed ${duplicateCount} duplicate skills`);
    
    // Recreate the proper index
    console.log('\n🔧 Creating proper index...');
    await skillsCollection.createIndex(
      { userId: 1, skill: 1 }, 
      { unique: true, name: 'userId_1_skill_1_unique' }
    );
    console.log('✅ Created userId_1_skill_1_unique index');
    
    // List final indexes
    console.log('\n📋 Final indexes:');
    const finalIndexes = await skillsCollection.indexes();
    finalIndexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('\n✅ Database cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the cleanup
cleanupDatabase(); 