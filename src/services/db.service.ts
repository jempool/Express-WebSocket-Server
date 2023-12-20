import { User } from "../models/user.ts";
import { Message } from "../models/message.ts";
import { Topic } from "../models/topic.model.ts";

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

// === Topics ===
export async function getTopicByDate(date) {
  return await Topic.findOne({ forDate: { $gte: date } }).select(
    "-_id -__v -forDate"
  );
}
