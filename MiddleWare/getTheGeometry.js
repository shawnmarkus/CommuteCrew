/*
 * the request body should have source and destination
 * format
 * source = destination ={longitude:..., latitude:... }
 * now after fetching the route successfully
 * req object now will contain a object as geometry

*/

const decode = require("@mapbox/polyline").toGeoJSON;
const axios = require("axios");

const getTheGeometry = async (req, res, next) => {
  const { source, destination } = req.body;
  const geometry = await fetchTheRoute(source, destination).catch((err) => {
    return res.status(400).json({ errMsg: err });
  });

  console.log("the geometry is ", geometry);
  req.geometry = geometry.routes[0].geometry;
  next();
};

const fetchTheRoute = async (source, destination) => {
  var url =
    "http://router.project-osrm.org/route/v1/driving/" +
    source.longitude +
    "," +
    source.latitude +
    ";" +
    destination.longitude +
    "," +
    destination.latitude;

  return axios.get(url).then(function (response) {
    return response.data;
  });
};

const getTheWaypoints = async (req, res) => {
  const { source, destination } = req.body;

  try {
    const geometry = await fetchTheRoute(source, destination);

    if (geometry.code === "Ok") {
      var decodedWaypoints = decode(geometry.routes[0].geometry);
      var decodedObj = [];
      var decodedWaypoints = decode(geometry.routes[0].geometry);
      for (let i of decodedWaypoints.coordinates) {
        var latitude = i[1];
        var longitude = i[0];
        decodedObj.push({ latitude, longitude });
      }
      return res.status(200).json(decodedObj);
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({ errMsg: err });
  }
};

module.exports = { getTheGeometry, getTheWaypoints };
