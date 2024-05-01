const mongoose = require("mongoose");
const Joi = require("joi");
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    comment: { type: String, required: true, minlength: 1 },
    level1: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, minlength: 1 },
        commentDate: { type: String },
        level2: [
          {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            comment: { type: String, minlength: 1 },
            commentDate: { type: String },
            level3: [
              {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                comment: { type: String, minlength: 1 },
                commentDate: { type: String },
              },
            ],
          },
        ],
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
    user: Joi.string().required(), // Assuming user is represented by a string (user ID)
    postId: Joi.string().required(), // Assuming postId is represented by a string (post ID)
    comment: Joi.string().required().min(1),
    level1: Joi.array().items(
      Joi.object({
        user: Joi.string().required(),
        comment: Joi.string().min(1).required(),
        commentDate: Joi.string().required(), // You might want to use a more specific date validation here
        level2: Joi.array().items(
          Joi.object({
            user: Joi.string().required(),
            comment: Joi.string().min(1).required(),
            commentDate: Joi.string().required(), // You might want to use a more specific date validation here
            level3: Joi.array().items(
              Joi.object({
                user: Joi.string().required(),
                comment: Joi.string().min(1).required(),
                commentDate: Joi.string().required(), // You might want to use a more specific date validation here
              })
            ),
          })
        ),
      })
    ),
  });
  return schema.validate(obj);
};
const updateComment = (obj) => {
  const schema = Joi.object({
    comment: Joi.string().min(1),
    level1: Joi.array().items(
      Joi.object({
        comment: Joi.string().min(1),
        level2: Joi.array().items(
          Joi.object({
            comment: Joi.string().min(1),
            level3: Joi.array().items(
              Joi.object({
                comment: Joi.string().min(1),
              })
            ),
          })
        ),
      })
    ),
  });
  return schema.validate(obj);
};
module.exports = {
  Comment,
  createComment,
  updateComment,
};
