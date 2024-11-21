import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();

export const connectMongo = async () => {
    return await mongoose.connect(`mongodb://${process.env.DB_MONGO_USER}:${process.env.DB_MONGO_PASS}@localhost:${process.env.DB_MONGO_PORT}/maks`, {
        authSource: "admin",  // указание authSource, так как root - это системный пользователь
    })
        .then(() => console.log('MongoDB connected'))
        .catch(err => {
            console.error(err)
            throw new Error('MongoDB connection error:')
        } );
}