//  this file contains the function of sign In and sign Up by User and Provider

const ProviderModel = require("../Models/Provider");

/*
 * function checkIdExist requires deviceId
 * This function will check for the corresponding Device Id in DB inside Providers Collection
 * If exist return details along with a token which will send along with the operation
 *  else response that user not exist with error code 404 not found and if error use error code 500 with error msg
 */

const checkIdExist = async (req, res) => {
  try {
    const userExist = await ProviderModel.find({
      devideId: req.params.deviceId,
    }).catch((error) => {
      console.log(error);
      const errorObj = new Error(`Internal server error : ${error}`);
      errorObj.statusCode = 500;
      throw errorObj;
    });

    if (!userExist) {
      return res.status(404).json({
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
    errorObj.statusCode = 500;
    throw errorObj;
  }
};

/*
 * function createProviderRecord requires {deviceId , userName, contactNumber, LicenceId , vehicalNo}
 * This function will create the user entry in Db
 */
const createProviderRecord = async (req, res) => {
  try {
    const { deviceId, userName, contactNumber, LicenceId, vehicalNo } =
      req.body;

    const createdUser = await ProviderModel.create({
      deviceId,
      userName,
      contactNumber,
      LicenceId,
      vehicalNo,
    }).catch((error) => {
      const errorObj = new Error(`Internal server error : ${error}`);
      errorObj.statusCode = 500;
      throw errorObj;
    });

    return res.status(200).json({
      status: "SUCCESS",
      user: createdUser,
    });
  } catch (error) {
    const errorObj = new Error(`Internal server error : ${error}`);
    errorObj.statusCode = 500;
    throw errorObj;
  }
};

modules.export = {
  checkIdExist,
  createProviderRecord,
};