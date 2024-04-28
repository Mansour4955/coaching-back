const mongoose = require("mongoose");
const Joi = require("joi");
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, minlength: 6, unique: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ["coach", "client"], required: true },
    profession: { type: String },
    course: { type: String },
    city: { type: String },
    method: { type: String },
    price: { type: Number, min: 0 },
    education: { type: String, minlength: 10 },
    about: { type: String, minlength: 10 },
    trainings: [
      {
        type: String,
      },
    ],
    softSkills: [
      {
        type: String,
      },
    ],
    experiences: [
      {
        type: String,
      },
    ],
    follow: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    appointmentOrders: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        date: { type: String },
        message: { type: String },
      },
    ],
    appointmentOnWait: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        date: { type: String },
      },
    ],
    appointmentAcceptedFromCoach: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        date: { type: String },
      },
    ],
    appointmentAccepted: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        date: { type: String },
      },
    ],
    coachNotifications: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        date: { type: String },
        action: { type: String, enum: ["cancel", "follow"] },
      },
    ],
    clientNotifications: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        date: { type: String },
        action: { type: String, enum: ["cancel", "accept"] },
      },
    ],
    reviews: [
      {
        name: { type: String },
        stars: { type: String, min: 3 },
        description: { type: String },
      },
    ],
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    profileImage: {
      type: String,
      default:
        "https://as2.ftcdn.net/v2/jpg/05/49/98/39/1000_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);

const registerUser = (obj) => {
  const schema = Joi.object({
    username: Joi.string().required().min(3),
    email: Joi.string().required().email().min(6),
    password: Joi.string().required().min(8),
    role: Joi.string().valid("coach", "client").required(),
    profession: Joi.string(),
    course: Joi.string(),
    city: Joi.string(),
    method: Joi.string(),
    price: Joi.number().min(0),
    education: Joi.string().min(10),
    about: Joi.string().min(10),
    trainings: Joi.array().items(Joi.string()),
    softSkills: Joi.array().items(Joi.string()),
    experiences: Joi.array().items(Joi.string()),
  });
  return schema.validate(obj);
};

const loginUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().required().email().min(6),
    password: Joi.string().required().min(8),
  });
  return schema.validate(obj);
};

const updateUser = (obj) => {
  const schema = Joi.object({
    username: Joi.string().min(3),
    password: Joi.string().min(8),
    profession: Joi.string(),
    course: Joi.string(),
    city: Joi.string(),
    method: Joi.string(),
    price: Joi.number().min(0),
    education: Joi.string().min(10),
    about: Joi.string().min(10),
    trainings: Joi.array().items(Joi.string()),
    softSkills: Joi.array().items(Joi.string()),
    experiences: Joi.array().items(Joi.string()),
    follow: Joi.array().items(Joi.string()),
    following: Joi.array().items(Joi.string()),
    appointmentOrders: Joi.array().items(
      Joi.object({
        user: Joi.string().required(),
        date: Joi.string().required(),
        message: Joi.string(),
      })
    ),
    appointmentOnWait: Joi.array().items(
      Joi.object({
        user: Joi.string().required(),
        date: Joi.string().required(),
      })
    ),
    appointmentAcceptedFromCoach: Joi.array().items(
      Joi.object({
        user: Joi.string().required(),
        date: Joi.string().required(),
      })
    ),
    appointmentAccepted: Joi.array().items(
      Joi.object({
        user: Joi.string().required(),
        date: Joi.string().required(),
      })
    ),
    coachNotifications: Joi.array().items(
      Joi.object({
        user: Joi.string().required(),
        date: Joi.string().required(),
        action: Joi.string().valid("cancel", "follow").required(),
      })
    ),
    clientNotifications: Joi.array().items(
      Joi.object({
        user: Joi.string().required(),
        date: Joi.string().required(),
        action: Joi.string().valid("cancel", "accept").required(),
      })
    ),
    reviews: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        stars: Joi.string().min(3).required(),
        description: Joi.string().required(),
      })
    ),
    chats: Joi.array().items(Joi.string()),
    posts: Joi.array().items(Joi.string()),
    profileImage: Joi.string().default(
      "https://as2.ftcdn.net/v2/jpg/05/49/98/39/1000_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
    ),
  });
  return schema.validate(obj);
};

module.exports = {
  User,
  registerUser,
  loginUser,
  updateUser,
};
