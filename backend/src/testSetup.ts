// This file is run before each test suite.
// You can put global test setup logic here.
// For example, setting up a mock database connection:

/*
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear all data after each test to ensure test isolation
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
*/

// For now, it's empty or contains simple console logs.
console.log('Global test setup file loaded.');

jest.setTimeout(10000); // Increase default timeout for tests if needed
