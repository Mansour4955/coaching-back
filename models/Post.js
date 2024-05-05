const mongoose = require("mongoose");
const Joi = require("joi");
const postSchema = new mongoose.Schema(
  {
    postImage: { type: String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String, required: true, minlength: 3 },
    domaine: {
      type: String,
      enum: [
        "Domaine sportif",
        "Psychologie",
        "Santé et nutrition",
        "Relations familiale",
        "Éducation et formation",
        "Spiritualité",
        "Motivation et productivité",
        "Finance et investissement",
        "Développement personnel",
      ],
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

const createPost = (obj) => {
  const schema = Joi.object({
    postImage: Joi.string(),
    description: Joi.string().required().min(3),
    domaine: Joi.string()
      .valid(
        "Domaine sportif",
        "Psychologie",
        "Santé et nutrition",
        "Relations familiale",
        "Éducation et formation",
        "Spiritualité",
        "Motivation et productivité",
        "Finance et investissement",
        "Développement personnel"
      )
      .required(),
  });
  return schema.validate(obj);
};
const updatePost = (obj) => {
  const schema = Joi.object({
    postImage: Joi.string(),
    description: Joi.string().min(3),
    domaine: Joi.string().valid(
      "Domaine sportif",
      "Psychologie",
      "Santé et nutrition",
      "Relations familiale",
      "Éducation et formation",
      "Spiritualité",
      "Motivation et productivité",
      "Finance et investissement",
      "Développement personnel"
    ),
    likes: Joi.array().items(Joi.string()),
    comments: Joi.array().items(Joi.string()),
  });
  return schema.validate(obj);
};
module.exports = {
  Post,
  createPost,
  updatePost,
};
