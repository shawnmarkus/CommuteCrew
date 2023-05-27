//  this file contains the function of sign In and sign Up by User and Provider

const UserModel = require("../Models/User");

/*
 * function checkIdExist requires deviceId
 * This function will check for the corresponding Device Id in DB inside Providers Collection
 * If exist return details along with a token which will send along with the operation
 *  else response that user not exist with error code 404 not found and if error use error code 500 with error msg
 */

const checkIdExist = async (req, res) => {
  try {
    const userExist = await UserModel.findOne({
      deviceId: req.params.deviceId,
    }).catch((error) => {
      console.log(error);
      const errorObj = new Error(`Internal server error : ${error}`);
      errorObj.statusCode = 200;
      throw errorObj;
    });

    if (!userExist) {
      return res.status(200).json({
        status: "USER_NOT_FOUND",
      });
    }

    // to get the token
    const usrToken = await userExist.getSignedToken();

    return res.status(200).json({
      status: "SUCCESS",
      user: userExist,
      usrToken,
    });
  } catch (error) {
    const errorObj = new Error(`Internal server error : ${error}`);
    errorObj.statusCode = 200;
    throw errorObj;
  }
};

/*
 * function createProviderRecord requires {deviceId , userName, contactNumber, LicenceId , vehicalNo}
 * This function will create the user entry in Db
 */
const createUserRecords = async (req, res) => {
  console.log("in create user");
  try {
    const { deviceId, userName, contactNumber } = req.body;

    const createdUser = await UserModel.create({
      deviceId,
      userName,
      contactNumber,
    }).catch((error) => {
      const errorObj = new Error(`Internal server error : ${error}`);
      errorObj.statusCode = 200;
      throw errorObj;
    });

    return res.status(200).json({
      status: "SUCCESS",
      user: createdUser,
    });
  } catch (error) {
    const errorObj = new Error(`Internal server error : ${error}`);
    errorObj.statusCode = 200;
    throw errorObj;
  }
};

const updateTheUser = async (req, res) => {
  const { _id, licenceId, vehicalNo } = req.body;

  if (_id && licenceId && vehicalNo) {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id },
      {
        carDetails: {
          licenceId,
          vehicalNo,
        },
      },
      { new: true }
    ).catch((err) => {
      return res.status(500).json({ err });
    });
    return res.status(200).json({ updatedUser });
  } else {
    return res.status(404).json({ errMsg: "NEEDED FEILD IS MISSING" });
  }
};

module.exports = {
  checkIdExist,
  createUserRecords,
  updateTheUser,
};
