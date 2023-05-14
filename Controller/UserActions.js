/*
    it contain the logic to get the suitable available route
*/

const PublishModel = require("../Models/PublishRide");

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
    });

    if (!rideList.length) {
      return res.status(404).json({
        status: "NO_RIDE_FOUND",
      });
    }

    return res.status(200).json({
      status: "SUCCESS",
      rideList,
    });
  } catch (error) {
    const errorObj = new Error(`Can't fetch for the list from DB: ${error}`);
    errorObj.statusCode = 500;
    throw errorObj;
  }
};

module.exports = { getRideList };
