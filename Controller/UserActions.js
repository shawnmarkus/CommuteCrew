/*
    it contain the logic to get the suitable available route
*/

const PublishModel = require("../Models/PublishRide");
const NodeGeocoder = require("node-geocoder");
/*
 * the function getRideList takes :
 * bounds of the circle of source coordinate  in [lng and lat]  format
 * bounds of the circle of destination coordinate  in [lng and lat]  format
 */

const getRideList = async (req, res) => {
  try {
    const { sourceBounds, destinationBounds } = req;

    console.log(sourceBounds);

    const rideList = await PublishModel.find({
      $and: [
        {
          location: {
            $geoIntersects: {
              $geometry: {
                type: "Polygon",
                coordinates: [sourceBounds],
              },
            },
          },
        },
        {
          location: {
            $geoIntersects: {
              $geometry: {
                type: "Polygon",
                coordinates: [destinationBounds],
              },
            },
          },
        },
      ],
    }).populate("providerDetailRef");

    if (!rideList.length) {
      return res.status(200).json({
        status: "NO_RIDE_FOUND",
        rideList: [],
      });
    }

    console.log("hurray");
    const options = {
      provider: "google",
      apiKey: process.env.API_KEY, // for Mapquest, OpenCage, Google Premier
      formatter: null, // 'gpx', 'string', ...
    };

    const geocoder = NodeGeocoder(options);
    for (let i = 0; i < rideList.length; i++) {
      const sourceLocNameRes = await geocoder.reverse({
        lat: rideList[i].source[1],
        lon: rideList[i].source[0],
      });
      const destinationLocNameRes = await geocoder.reverse({
        lat: rideList[i].destination[1],
        lon: rideList[i].destination[0],
      });

      rideList[i].source = sourceLocNameRes[0].formattedAddress;
      rideList[i].destination = destinationLocNameRes[0].formattedAddress;
    }

    return res.status(200).json({
      status: "SUCCESS",
      rideList,
    });
  } catch (error) {
    const errorObj = new Error(`Can't fetch for the list from DB: ${error}`);
    errorObj.statusCode = 200;
    throw errorObj;
  }
};

module.exports = { getRideList };
