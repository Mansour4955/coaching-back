const mongoose = require("mongoose");
const Joi = require("joi");
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true, minlength: 10 },
    author: { type: Schema.Types.ObjectId, ref: "Owner" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    images: [
      {
        url: { type: String },
        publicId: { type: String, default: null },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});
const Post = mongoose.model("Post", postSchema);

const createPost = (obj) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3),
    description: Joi.string().required().min(10),
    author: Joi.string().required(),
  });
  return schema.validate(obj);
};
const updatePost = (obj) => {
  const schema = Joi.object({
    title: Joi.string().min(3),
    description: Joi.string().min(10),
    likes: Joi.array().items(Joi.string()),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().required(),
        publicId: Joi.string()
          .required()
          .error(new Error("publicId must not be null")),
      })
    ),
  });
  return schema.validate(obj);
};
module.exports = {
  Post,
  createPost,
  updatePost,
};
