const mongoose = require("mongoose");
const Joi = require("joi");
const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true, minlength: 1 },
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.model("Message", messageSchema);

const createMessage = (obj) => {
  const schema = Joi.object({
    sender: Joi.string().required(),
    message: Joi.string().min(1).required(),
  });
  return schema.validate(obj);
};
const updateMessage = (obj) => {
  const schema = Joi.object({
    message: Joi.string().min(1),
  });
  return schema.validate(obj);
};
module.exports = {
  Message,
  createMessage,
  updateMessage,
};
