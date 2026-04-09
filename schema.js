const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

// ✅ Appointment validation schema
module.exports.appointmentSchema = Joi.object({
  fullName: Joi.string().required(),
  enrollment: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow("", null),
  date: Joi.date().required(),
  time: Joi.string().allow("", null),
  sessionType: Joi.string().required(),
  notes: Joi.string().allow("", null),
});
