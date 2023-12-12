import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
    required: true,
  },
});

MessageSchema.method("toResponseObject", function () {
  return {
    name: this.message,
    email: this.handle,
  };
});

const Message = mongoose.model("Message", MessageSchema);

export { Message };
