/*
 * the request body should have source and destination 
 * format 
 * source = destination ={longitude , latitude }
 * now after fetching the route successfully 
 * req object now will contain a object as geometry

*/

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
    source[0] +
    "," +
    source[1] +
    ";" +
    destination[0] +
    "," +
    destination[1];

  return fetch(url).then(function (response) {
    return response.json();
  });
  // .then(function (data) {
  //   var route = data.routes[0].geometry;
  //   console.log(data);
  // });
  // .catch(function (error) {
  //   console.log("Error: " + error);
  // });
};

module.exports = { getTheGeometry };
