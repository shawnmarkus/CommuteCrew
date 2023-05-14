const routerPath = require("express").Router();
const { checkIdExist, createProviderRecords } = require("../Controller/Auth");
const { publishRide, deleteRide } = require("../Controller/PublishRideAction");
const { getRideList } = require("../Controller/UserActions");
const { VerifyToken } = require("../MiddleWare/VerifyToken");
const { getQuardrilateralBounds } = require("../MiddleWare/getBounds");

// to check the Device_id exist or not
routerPath.route("/auth/:deviceId").get(checkIdExist);

// to create a record corresponding to the device using device_id
routerPath.route("/auth/provider/create").post(createProviderRecords);

//  to publish a ride
routerPath.route("/publishRide").post(VerifyToken, publishRide);

// to get the list of the rides available
routerPath.route("/getList").get(getQuardrilateralBounds, getRideList);

// to delete the ride by providerside
routerPath.route("/provider/deleteride").delete(deleteRide);

module.exports = routerPath;
