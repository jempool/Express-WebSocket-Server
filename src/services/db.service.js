import { User } from "../models/user.js";


export async function getUserByEmail(email) {
  return await User.findOne({ email });
}

export async function createUser(user) {
  const newUser = new User({ ...user });
  return await newUser.save();
}
