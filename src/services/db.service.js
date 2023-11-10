import { MongoClient } from "mongodb";
import { DATABASE_URL, DATABASE_NAME } from "../utils/constants.js";


const client = new MongoClient(DATABASE_URL);
const db = client.db(DATABASE_NAME);

export async function getUserByEmail(email) {
  return await db.collection("users").findOne({ email });
}

export async function createUser(user) {
  return await db.collection("users").insertOne(user);
}
