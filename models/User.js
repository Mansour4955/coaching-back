const mongoose = require("mongoose");
const Joi = require("joi");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, minlength: 6, unique: true },
    password: { type: String, required: true, minlength: 8 },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);

const registerUser = (obj) => {
  const schema = Joi.object({
    name: Joi.string().min(3).trim().required(),
    email: Joi.string().min(6).trim().email().required(),
    password: Joi.string().min(8).trim().required(),
  });
  return schema.validate(obj);
};

const loginUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().min(6).trim().email().required(),
    password: Joi.string().min(8).trim().required(),
  });
  return schema.validate(obj);
};

module.exports = {
  User,
  registerUser,
  loginUser,
};
