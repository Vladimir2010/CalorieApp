const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/calorie-app';
        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.log('---');
        console.log('TIP: Ensure your MongoDB service is running (mongod).');
        console.log('For the Olympiad, I recommend using a free MongoDB Atlas cloud cluster.');
        console.log('---');
        process.exit(1);
    }
};

module.exports = connectDB;
