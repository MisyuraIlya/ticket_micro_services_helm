import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from "supertest";
import jwt from 'jsonwebtoken';

declare global {
    namespace NodeJS {
        interface Global {
            signin: () => string;
        }
    }
}
  
jest.mock('../nats-wrapper');

let mongo: MongoMemoryServer;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdasd';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }as mongoose.ConnectOptions);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db!.collections();
    for (let collection of collections) {
        await collection.deleteMany();
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

global.signin = () => {
    // Build a JWT payload { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }
    // create the JWT 
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // build session object { jwt: MY_JWT }

    const session = {jwt:token};

    // Turn that session into json

    const sessionJSON = JSON.stringify(session)

    // take json and encode it as base64

    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with the encoded data

    return `session=${base64}`
};
