const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["student", "admin"], // Only two roles needed
  },
  username: {
    type: String,
    unique: true
  },
  // Student Fields
  collegeName: { type: String },
  currentYear: { type: Number },
  enrollmentNumber: { type: String },
  // Admin Fields
  passKey: { type: String },
});

// Adds username + password hash/salt via passport-local-mongoose
// Configure to use 'email' as the username field
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model("User", userSchema);
