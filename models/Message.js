const mongoose = require("mongoose");
const Joi = require("joi");
const messageSchema = new mongoose.Schema(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat"},
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true, minlength: 1 },
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.model("Message", messageSchema);

const createMessage = (obj) => {
  const schema = Joi.object({});
  return schema.validate(obj);
};
const updateMessage = (obj) => {
  const schema = Joi.object({});
  return schema.validate(obj);
};
module.exports = {
  Message,
  createMessage,
  updateMessage,
};
