const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  login: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: true },
  isSuperAdmin: { type: Boolean, default: true },
  knownWords: [{ type: String }],
  lastVisit: { type: Date, default: Date.now },
});

module.exports = model("User", userSchema);
