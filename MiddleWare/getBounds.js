/*
 * this middleware is used to generate the quadrilateral bound(sqaure)
 * req.body must have source , destination and radius
 * it takes source and destination as source:{latitude:...,longitude:...} ande= destination:{latitude:...,longitude:...}
 */
const getQuardrilateralBounds = async (req, res, next) => {
  const { source, destination, radius } = req.body;
  if (source && destination) {
    const sourceBounds = getBounds(source, radius);
    const destinationBounds = getBounds(destination, radius);
    req.sourceBounds = sourceBounds;
    req.destinationBounds = destinationBounds;
    next();
  } else {
    console.log("provide data requirement is of source and destination")
    return res.status(400).json({
      errorMsg: "provide data requirement is of source and destination",
    });
  }
};

const getBounds = (center, radius) => {
  const latDelta = radius / 111000;

  const lonDelta =
    radius / (111000 * Math.cos(center.latitude * (Math.PI / 180)));

  const minLat = Number(center.latitude) - Number(latDelta);

  const maxLat = center.latitude + latDelta;

  const minLon = center.longitude - lonDelta;

  const maxLon = center.longitude + lonDelta;

  const bounds = [
    [minLat, minLon].reverse(), //1st corner
    [minLat, maxLon].reverse(), //2nd corner
    [maxLat, maxLon].reverse(), //3rdcorner
    [maxLat, minLon].reverse(), //4th corner
    [minLat, minLon].reverse(), //1st corner
  ];

  return bounds;
};

module.exports = { getQuardrilateralBounds };
