import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'mydb';

const client = new MongoClient(url);
const db = client.db(dbName);

export async function getCustomers(req, res) {
    const r = await db.collection("customers").find().toArray();
    return res.send(r);
}

export async function createCustomers(req, res) {
    const r = await db.collection("customers").insertOne(req.body);
    return res.send(r);
}