const mongoose = require("mongoose");
const Joi = require("joi");
const chatSchema = new mongoose.Schema(
  {
    users:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    timestamps: true,
  }
);
const Chat = mongoose.model("Chat", chatSchema);

const createChat = (obj) => {
  const schema = Joi.object({
    users: Joi.array().items(Joi.string()).required(),
  });
  return schema.validate(obj);
};
const updateChat = (obj) => {
  const schema = Joi.object({
    messages: Joi.array().items(Joi.string()),
  });
  return schema.validate(obj);
};
module.exports = {
  Chat,
  createChat,
  updateChat,
};
