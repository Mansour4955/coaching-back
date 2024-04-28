const mongoose = require("mongoose");
const Joi = require("joi");
const chatSchema = new mongoose.Schema(
  {
    members: [],
  },
  {
    timestamps: true,
  }
);
const Chat = mongoose.model("Chat", chatSchema);

const createChat = (obj) => {
  const schema = Joi.object({
    members: Joi.array().items(Joi.string().min(1)).required(),
  });
  return schema.validate(obj);
};
const updateChat = (obj) => {
  const schema = Joi.object({
    members: Joi.array().items(Joi.string().min(1)),
  });
  return schema.validate(obj);
};
module.exports = {
  Chat,
  createChat,
  updateChat,
};
