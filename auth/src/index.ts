import mongoose from 'mongoose';
import { app } from './app';

const connectWithRetry = async () => {
    let retries = 5;
    while (retries) {
        try {
            await mongoose.connect(process.env.MONGO_URI!);
            console.log('Connected to MongoDB');
            break; // Break the loop if the connection is successful
        } catch (err) {
            retries -= 1;
            console.log(`Retrying MongoDB connection (${5 - retries}/5)`, err);
            await new Promise(res => setTimeout(res, 5000)); // Wait for 5 seconds before retrying
        }
    }

    if (retries === 0) {
        throw new Error('Could not connect to MongoDB after several attempts');
    }
};

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    try {
        // Attempt to connect to MongoDB with retries
        await connectWithRetry();
    } catch (err) {
        console.error('Failed to start the service:', err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!!');
    });
};

start();
