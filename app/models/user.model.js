const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: [true, "Username wajib diisi"],
    },
    email: String,
    password: String,
    roles: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  })
);

module.exports = User;
