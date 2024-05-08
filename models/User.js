const mongoose = require("mongoose");
const Joi = require("joi");
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, minlength: 6, unique: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ["coach", "client"], required: true },
    profession: { type: String },
    course: {
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
    },
    city: {
      type: String,
      enum: [
        "Casablanca",
        "Tanger",
        "Fès",
        "Marrakech",
        "Meknès",
        "Agadir",
        "Rabat",
        "Oujda",
        "Kénitra",
        "Tétouan",
        "Laayoune",
        "Mohammédia",
        "El Jadida",
        "Khouribga",
        "Béni Mellal",
        "Khémisset",
        "Nador",
        "Taza",
        "Berkane",
        "Safi",
      ],
    },
    method: {
      type: String,
      enum: ["Face to face", "Webcam", "Face to face & webcam"],
    },
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
    follow: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    appointmentOrders: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: String },
        message: { type: String },
      },
    ],
    appointmentOnWait: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: String },
      },
    ],
    appointmentAcceptedFromCoach: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: String },
      },
    ],
    appointmentAccepted: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: String },
      },
    ],
    coachNotifications: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: String },
        action: { type: String, enum: ["cancel", "follow"] },
      },
    ],
    clientNotifications: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    profileImage: {
      type: String,
      default: "2024-05-08T17-48-27.490Zfaith.png",
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
    course: Joi.string().valid(
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
    city: Joi.string().valid(
      "Casablanca",
      "Tanger",
      "Fès",
      "Marrakech",
      "Meknès",
      "Agadir",
      "Rabat",
      "Oujda",
      "Kénitra",
      "Tétouan",
      "Laayoune",
      "Mohammédia",
      "El Jadida",
      "Khouribga",
      "Béni Mellal",
      "Khémisset",
      "Nador",
      "Taza",
      "Berkane",
      "Safi"
    ),
    method: Joi.string().valid(
      "Face to face",
      "Webcam",
      "Face to face & webcam"
    ),
    price: Joi.number().min(0),
    education: Joi.string().min(10),
    about: Joi.string().min(10),
    trainings: Joi.array().items(Joi.string()),
    softSkills: Joi.array().items(Joi.string()),
    experiences: Joi.array().items(Joi.string()),
    profileImage: Joi.string(),
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
    course: Joi.string().valid(
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
    city: Joi.string().valid(
      "Casablanca",
      "Tanger",
      "Fès",
      "Marrakech",
      "Meknès",
      "Agadir",
      "Rabat",
      "Oujda",
      "Kénitra",
      "Tétouan",
      "Laayoune",
      "Mohammédia",
      "El Jadida",
      "Khouribga",
      "Béni Mellal",
      "Khémisset",
      "Nador",
      "Taza",
      "Berkane",
      "Safi"
    ),
    method: Joi.string().valid(
      "Face to face",
      "Webcam",
      "Face to face & webcam"
    ),
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
    profileImage: Joi.string(),
  });
  return schema.validate(obj);
};

module.exports = {
  User,
  registerUser,
  loginUser,
  updateUser,
};
