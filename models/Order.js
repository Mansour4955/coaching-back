const mongoose = require("mongoose");
const Joi = require("joi");
const orderSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, min: 1 },
    clientName: { type: String, required: true, minlength: 2 },
    foodList: [{ type: Schema.Types.ObjectId, ref: "Menu" }],
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);

const createOrder = (obj) => {
  const schema = Joi.object({
    number: Joi.string().required().min(1),
    clientName: Joi.string().required().min(2),
    foodList: Joi.array().items(Joi.string().required()).required(),
  });
  return schema.validate(obj);
};

module.exports = {
  Order,
  createOrder,
};
