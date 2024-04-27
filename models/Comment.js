const mongoose = require("mongoose");
const Joi = require("joi");
const commentSchema = new mongoose.Schema(
  {
    message: { type: String, required: true, minlength: 1 },
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
const Comment = mongoose.model("Comment", commentSchema);

const createComment = (obj) => {
  const schema = Joi.object({
    message: Joi.string().required().min(1),
    author: Joi.string().required(),
  });
  return schema.validate(obj);
};
const updateComment = (obj) => {
  const schema = Joi.object({
    message: Joi.string().required().min(1),
  });
  return schema.validate(obj);
};
module.exports = {
    Comment,
    createComment,
    updateComment,
};
