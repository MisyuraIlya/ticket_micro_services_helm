import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from "supertest";

declare global {
    namespace NodeJS {
        interface Global {
            signin: () => Promise<string[]>;
        }
    }
}
  
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

// @ts-ignore
global.signin = async () => {
    const email = 'test@gmail.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie as unknown as string[];  // Return an array containing the cookie
};