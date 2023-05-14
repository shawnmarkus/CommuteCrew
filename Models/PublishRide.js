const mongoose = require("mongoose");
const ProviderModel = require("./Provider");

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
    ref: ProviderModel,
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
