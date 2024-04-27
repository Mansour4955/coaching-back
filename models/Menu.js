const mongoose = require("mongoose");
const Joi = require("joi");
const menuSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true, minlength: 10 },
    price: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Bakery",
        "Dairy",
        "Fruit",
        "Vegetable",
        "Meat",
        "Seafood",
        "Grains",
        "Beverage",
        "Sweets",
        "Other",
      ],
    },
    images: [
      {
        url: { type: String },
        publicId: { type: String, default: null },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Menu = mongoose.model("Menu", menuSchema);

const createMenu = (obj) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    price: Joi.string().required(),
    category: Joi.string()
      .valid(
        "Bakery",
        "Dairy",
        "Fruit",
        "Vegetable",
        "Meat",
        "Seafood",
        "Grains",
        "Beverage",
        "Sweets",
        "Other"
      )
      .required(),
    images: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().required(),
          publicId: Joi.string()
            .required()
            .error(new Error("publicId must not be null")),
        })
      )
      .required(),
  });
  return schema.validate(obj);
};
const updateMenu = (obj) => {
  const schema = Joi.object({
    title: Joi.string().min(3),
    description: Joi.string().min(10),
    price: Joi.string(),
    category: Joi.string().valid(
      "Bakery",
      "Dairy",
      "Fruit",
      "Vegetable",
      "Meat",
      "Seafood",
      "Grains",
      "Beverage",
      "Sweets",
      "Other"
    ),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string(),
        publicId: Joi.string()
          .required()
          .error(new Error("publicId must not be null")),
      })
    ),
  });
  return schema.validate(obj);
};
module.exports = {
  Menu,
  createMenu,
  updateMenu,
};
