const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const SubSchemaOfCarDetails = mongoose.Schema({
  licenceId: {
    type: String,
    required: true,
  },

  vehicalNo: {
    type: String,
    required: true,
  },
});

const ProviderSchema = mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
  },

  userName: {
    type: String,
    required: true,
  },

  contactNumber: {
    type: Number,
    required: true,
  },

  carDetails: SubSchemaOfCarDetails,
});

// method to generate the token
ProviderSchema.methods.getSignedToken = async function () {
  return jwt.sign(
    { _id: this._id, deviceId: this.deviceId },
    process.env.SECRET_TOKEN,
    {
      expiresIn: "1d",
    }
  );
};

const ProviderModel = mongoose.model("Providers", ProviderSchema);

module.exports = ProviderModel;
