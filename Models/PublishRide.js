const mongoose = require("mongoose");
const userModel = require("./User");

const PublishRideSchema = mongoose.Schema({
  source: {
    type: {},
    required: true,
  },

  avilability: {
    type: Number,
    required: true,
  },

  destination: {
    type: {},
    required: true,
  },

  DateAndTime: {
    type: Date,
    required: true,
  },

  description: {
    type: String,
  },

  providerDetailRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel,
    required: true,
  },

  location: {
    type: {
      type: String,
      required: true,
    },

    coordinates: {
      type: Array,
      required: true,
    },
  },
});

const PublishModel = mongoose.model("rideList", PublishRideSchema);

module.exports = PublishModel;
