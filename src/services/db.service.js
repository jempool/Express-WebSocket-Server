import { User } from "../models/user.js";
import { Message } from "../models/message.js";

// === Users ====

export async function getUserByEmail(email) {
  return await User.findOne({ email });
}

export async function createUser(user) {
  const newUser = new User({ ...user });
  return await newUser.save();
}


// === Chat ===

export async function getAllHistory() {
  return await Message.find({});
}

export async function addMessage(message) {
  const newMessage = new Message({ ...message });
  return await newMessage.save();
}
