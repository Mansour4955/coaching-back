const mongoose = require("mongoose");
const Joi = require("joi");
// Define your enum values
const typeEnum = [
  "Fine Dining",
  "Casual Dining",
  "Fast Casual",
  "Fast Food",
  "Café",
  "Bistro",
  "Buffet",
  "Food Truck",
  "Pizzeria",
  "Barbecue (BBQ)",
];
const moroccanCities = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fes",
  "Tangier",
  "Agadir",
  "Essaouira",
  "Chefchaouen",
  "Ouarzazate",
  "Fez",
  "Oujda",
  "Tetouan",
  "El Jadida",
  "Kenitra",
  "Sale",
  "Mohammedia",
  "Meknes",
  "Taroudant",
  "Beni Mellal",
  "Nador",
  "Settat",
  "Taza",
  "Khouribga",
  "Larache",
  "Khenifra",
  "Safi",
  "Tiznit",
  "Al Hoceima",
  "Figuig",
  "Guelmim",
  "Tantan",
  "Lagouira",
];
const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, minlength: 3 },
    description: {
      type: String,
      trim: true,
      minlength: 12,
      maxlength: 120,
      default: "Your description",
    },
    email: {
      type: String,
      trim: true,
      required: true,
      minlength: 6,
      unique: true,
    },
    password: { type: String, trim: true, required: true, minlength: 8 },
    verification: { type: Boolean, trim: true, default: false },
    type: { type: String, trim: true, enum: typeEnum, required: true },
    bio: { type: String, trim: true, default: "Your bio" },
    phone: { type: String, trim: true, default: "Your phone number" },
    whatsapp: { type: String, trim: true, default: "Your whatsapp" },
    message: { type: String, trim: true, default: "Your welcome message" },
    logo: {
      url: {
        type: String,
        default:
          "https://images.pexels.com/photos/3689532/pexels-photo-3689532.jpeg",
      },
      publicId: { type: String, default: null },
    },
    city: { type: String, trim: true, enum: moroccanCities, required: true },
    localisation: { type: String, trim: true, default: "Your localisation" },
    rib: { type: String, trim: true },
    images: [
      {
        url: {
          type: String,
          default:
            "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
        },
        publicId: { type: String, default: null },
      },
      {
        url: {
          type: String,
          default:
            "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
        },
        publicId: { type: String, default: null },
      },
    ],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    owners: [{ type: Schema.Types.ObjectId, ref: "Owner" }],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    menu: [{ type: Schema.Types.ObjectId, ref: "Menu" }],
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

const registerRestaurant = (obj) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).required(),
    email: Joi.string().trim().min(6).email().required(),
    password: Joi.string().trim().min(8).required(),
    type: Joi.string()
      .trim()
      .valid(...typeEnum)
      .required(),
    city: Joi.string()
      .trim()
      .valid(...moroccanCities)
      .required(),
  });
  return schema.validate(obj);
};

const loginRestaurant = (obj) => {
  const schema = Joi.object({
    email: Joi.string().min(6).email().trim().required(),
    password: Joi.string().min(8).trim().required(),
  });
  return schema.validate(obj);
};

const updateRestaurant = (obj) => {
  const schema = Joi.object({
    name: Joi.string().min(3).trim(),
    password: Joi.string().min(8).trim(),
    type: Joi.string()
      .valid(...typeEnum)
      .trim(),
    city: Joi.string()
      .valid(...moroccanCities)
      .trim(),
    bio: Joi.string().min(12).max(120).trim(),
    description: Joi.string().min(12).max(120).trim(),
    phone: Joi.string().min(8).trim(),
    whatsapp: Joi.string().min(8).trim(),
    message: Joi.string().min(6).trim(),
    localisation: Joi.string().min(6).trim(),
    rib: Joi.string().min(6).trim(),
    logo: Joi.object({
      url: Joi.string().required(),
      publicId: Joi.string().required(),
    }),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().required(),
        publicId: Joi.string().required(),
      })
    ),
  });
  return schema.validate(obj);
};
module.exports = {
  Restaurant,
  registerRestaurant,
  loginRestaurant,
  updateRestaurant,
};
