const routerPath = require("express").Router();
const {
  checkIdExist,
  createUserRecords,
  updateTheUser,
} = require("../Controller/Auth");
const {
  publishRide,
  deleteRide,
  getProvidersRideList,
} = require("../Controller/PublishRideAction");
const { getRideList } = require("../Controller/UserActions");
const { VerifyToken } = require("../MiddleWare/VerifyToken");
const { getQuardrilateralBounds } = require("../MiddleWare/getBounds");
const {
  getTheGeometry,
  getTheWaypoints,
} = require("../MiddleWare/getTheGeometry");

// to check the Device_id exist or not
routerPath.route("/auth/:deviceId").get(checkIdExist);

// to create a record corresponding to the device using device_id
routerPath.route("/auth/user/create").post(createUserRecords);

// to update the record of user
routerPath.route("/auth/user/update").patch(updateTheUser);

// route to get the all published ride against a particular provider
routerPath.route("/provider/getRidesList").post(getProvidersRideList);

//  to publish a ride
routerPath.route("/publishRide").post(VerifyToken, getTheGeometry, publishRide);

// to get the list of the rides available
routerPath.route("/getList").post(getQuardrilateralBounds, getRideList);

// to delete the ride by providerside
routerPath.route("/provider/deleteride").delete(deleteRide);

// route to get the waypoint
routerPath.route("/getWaypoints").post(getTheWaypoints);

module.exports = routerPath;
