const mongoose = require("mongoose");
const Joi = require("joi");
const commentSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    comment: { type: String, required: true, minlength: 1 },
    level1: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, minlength: 1 },
        commentDate: { type: String },
      },
    ],
    level2: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, minlength: 1 },
        commentDate: { type: String },
      },
    ],
    level3: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, minlength: 1 },
        commentDate: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Comment = mongoose.model("Comment", commentSchema);

const createComment = (obj) => {
  const schema = Joi.object({
    user: Joi.string().required(), 
    postId: Joi.string().required(), 
    comment: Joi.string().min(1).required()
  });
  return schema.validate(obj);
};
const updateComment = (obj) => {
  const schema = Joi.object({
    comment: Joi.string().min(1), 
    level1: Joi.array().items(Joi.object({
      user: Joi.string(),
      comment: Joi.string().min(1), 
      commentDate: Joi.string()
    })),
    level2: Joi.array().items(Joi.object({
      user: Joi.string(),
      comment: Joi.string().min(1),
      commentDate: Joi.string()
    })),
    level3: Joi.array().items(Joi.object({
      user: Joi.string(),
      comment: Joi.string().min(1), 
      commentDate: Joi.string()
    }))
  });
  return schema.validate(obj);
};
module.exports = {
  Comment,
  createComment,
  updateComment,
};
