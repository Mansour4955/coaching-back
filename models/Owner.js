const mongoose = require("mongoose");
const Joi = require("joi");
const roles = ["Manager", "Supervisor", "Employee"];
const ownerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, minlength: 6, unique: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: roles, default: "Employee" },
    bio: { type: String, default: "Your bio" },
    profilePhoto: {
      url: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
      },
      publicId: { type: String, default: null },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
ownerSchema.virtual("posts", {
  ref: "Post",
  foreignField: "owner",
  localField: "_id",
});
const Owner = mongoose.model("Owner", ownerSchema);

const registerOwner = (obj) => {
  const schema = Joi.object({
    name: Joi.string().min(3).trim().required(),
    email: Joi.string().min(6).trim().email().required(),
    password: Joi.string().min(8).trim().required(),
  });
  return schema.validate(obj);
};

const loginOwner = (obj) => {
  const schema = Joi.object({
    email: Joi.string().min(6).trim().email().required(),
    password: Joi.string().min(8).trim().required(),
  });
  return schema.validate(obj);
};

const updateOwner = (obj) => {
  const schema = Joi.object({
    name: Joi.string().min(3).trim(),
    password: Joi.string().min(8).trim(),
    bio: Joi.string().min(12).max(120).trim(),
    profilePhoto: Joi.object({
      url: Joi.string().required(),
      publicId: Joi.string().required(),
    }),
  });
  return schema.validate(obj);
};
module.exports = {
  Owner,
  registerOwner,
  loginOwner,
  updateOwner,
};
