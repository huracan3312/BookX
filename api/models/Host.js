const mongoose = require("mongoose");

const hostSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    address: { type: String, required: true },
    photos: [String],
    description: { type: String },
    currency: { type: String },
    country: { type: String },
    timeZone: { type: String },
    phone: { type: String },
    email: { type: String },
    website: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Host", hostSchema);
