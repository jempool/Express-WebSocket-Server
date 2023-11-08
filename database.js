import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'mydb';

const client = new MongoClient(url);
const db = client.db(dbName);

export async function getUserByEmail(email) {
    return await db.collection("users").findOne({ email });
}

export async function createUser(user) {
    return await db.collection("users").insertOne(user);
}