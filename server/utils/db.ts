import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl: string = process.env.DB_URL || '';

if (!dbUrl) {
    console.error('Database URL not found in environment variables');
    process.exit(1);
} else {
    console.log(`Connecting to database with URL: ${dbUrl}`);
}

const connectDB = async () => {
    try {
        const data = await mongoose.connect(dbUrl);
        console.log(`Database connected with ${data.connection.host}`);
    } catch (error: any) {
        console.log('Database connection error:', error.message);
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;
