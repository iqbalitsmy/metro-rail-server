const Mongoose = require("mongoose")

const UserSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  image: {
    type: String,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    default: "basic",
  },
  status: {
    type: String,
    default: "active",
  },
})

const User = Mongoose.model("user", UserSchema)
module.exports = User