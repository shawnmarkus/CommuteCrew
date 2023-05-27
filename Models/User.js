const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const SubSchemaOfCarDetails = mongoose.Schema({
  licenceId: {
    type: String,
  },

  vehicalNo: {
    type: String,
  },
});

const userSchema = mongoose.Schema({
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

  carDetails: {
    type: SubSchemaOfCarDetails,
  },
});

// method to generate the token
userSchema.methods.getSignedToken = async function () {
  return jwt.sign(
    { _id: this._id, deviceId: this.deviceId },
    process.env.SECRET_TOKEN,
    {
      expiresIn: "1d",
    }
  );
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
