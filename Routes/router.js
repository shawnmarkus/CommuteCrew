const routerPath = require("express").Router();
const { checkIdExist, createProviderRecords } = require("../Controller/Auth");
const { publishRide } = require("../Controller/PublishRIdeAction");
const { getRideList } = require("../Controller/UserActions");
const { VerifyToken } = require("../MiddleWare/VerifyToken");

// to check the Device_id exist or not
routerPath.route("/auth/:deviceId").get(checkIdExist);

// to create a record corresponding to the device using device_id
routerPath.route("/auth/provider/create").post(createProviderRecords);

//  to publish a ride
routerPath.route("/publishRide").post(VerifyToken, publishRide);

// to get the list of the rides available
routerPath.route("/getList").get(getRideList);