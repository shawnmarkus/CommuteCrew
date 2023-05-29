//    it contain the logic to provide the routes

const PublishModel = require("../Models/PublishRide");
const decode = require("@mapbox/polyline").toGeoJSON;
const NodeGeocoder = require("node-geocoder");
/*
 * now the function publish Ride will create a record in collection provideRide
 * this function will take 7 inputs and these are
 * source place name ===> {latitude:..., longitude:...}
 * destination place name ====> {latitude:..., longitude:...}
 * DateAndTime
 * description OPTIONAL
 * providerDetailRef ==> this will be taken from req.userState which exist when user is verified using jwt, where _id it will contained inside (this will contain the _id which is used to reference the provider detail in provider collection )
 *  type and encodedGeometry
 * the encodedGeometryData is sent which is converted to waypoints
 * NOTE: waypoints must be array of array ex:[[lng1,lat1],[lng2,lat2]...]
 */

const publishRide = async (req, res) => {
  console.log("inside publish ride");
  try {
    const { source, destination, DateAndTime, avilability, description } =
      req.body;
    const encodedGeometry = req.geometry;
    console.log(encodedGeometry);
    console.log(`date and time is as : ${DateAndTime}`);
    const createdRide = await PublishModel.create({
      source,
      destination,
      avilability,
      DateAndTime,
      description,
      providerDetailRef: req.userState._id,
      location: decode(encodedGeometry),
    }).catch((error) => {
      const errorObj = new Error(`Internal server error : ${error}`);
      errorObj.statusCode = 500;
      throw errorObj;
    });

    return res.status(200).json({
      status: "SUCCESS",
      user: createdRide,
    });
  } catch (error) {
    const errorObj = new Error(`Internal server error : ${error}`);
    errorObj.statusCode = 500;
    throw errorObj;
  }
};

/*
 * do delete a ride
 * rideId is required
 */

const deleteRide = async (req, res) => {
  try {
    const { rideId } = req.body;
    const deletedRide = await PublishModel.findOneAndDelete({ rideId }).catch(
      (error) => {
        return res.status(500).json(error.data);
      }
    );
    return res.status(200).json(deletedRide);
  } catch (error) {
    const errorObj = new Error(`Internal server error : ${error}`);
    errorObj.statusCode = 500;
    throw errorObj;
  }
};

const getProvidersRideList = async (req, res) => {
  const { _id } = req.body;
  const options = {
    provider: "google",
    apiKey: process.env.API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null, // 'gpx', 'string', ...
  };
  const geocoder = NodeGeocoder(options);
  try {
    const listofRides = await PublishModel.find({
      providerDetailRef: _id,
    }).populate("providerDetailRef");
    // .catch((err) => res.json({ status: "FAILED", error: err }));

    for (let i = 0; i < listofRides.length; i++) {
      const sourceLocNameRes = await geocoder.reverse({
        lat: listofRides[i].source.latitude,
        lon: listofRides[i].source.longitude,
      });

      const destinationLocNameRes = await geocoder.reverse({
        lat: listofRides[i].destination.latitude,
        lon: listofRides[i].destination.longitude,
      });

      listofRides[i].source = sourceLocNameRes[0].formattedAddress;
      listofRides[i].destination = destinationLocNameRes[0].formattedAddress;
    }

    if (!listofRides.length) {
      return res.json({ status: "NO RECORD FOUND" });
    }
    return res.json({ status: "SUCCESS", listofRides });
  } catch (err) {
    return res.status(200).json({ status: "FAILED", err });
  }
};

module.exports = { publishRide, deleteRide, getProvidersRideList };
