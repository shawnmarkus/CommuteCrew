//    it contain the logic to provide the routes

const PublishModel = require("../Models/PublishRide");
const decode = require("@mapbox/polyline").toGeoJSON;
/*
 * now the function publish Ride will create a record in collection provideRide
 * this function will take 7 inputs and these are
 * source place name
 * destination place name
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

module.exports = { publishRide, deleteRide };
