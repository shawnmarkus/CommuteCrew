const mongoose = require("mongoose");
const ProviderModel = require("./Provider");

const PublishRideSchema = mongoose.Schema({
  source: {
    type: String,
    required: true,
  },

  destination: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  time: {
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

const PublishModel = mongoose.model("PublishedRide", PublishRideSchema);

module.exports = PublishModel;
