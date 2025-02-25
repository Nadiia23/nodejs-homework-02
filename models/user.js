const { Schema, model} = require("mongoose");

const userSchema= Schema ({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  name: {
    type: String,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
    },
  token: {
    type: String,
    default: ""
  },
  avatarURL: {
    type: String,
    required: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
}, {versionKey: false, timestamp: true})

const User = model("users", userSchema);
module.exports = User;