//  a middle ware to indentify the token and check the device where is used

const UserModel = require("../Models/User");
const jwt = require("jsonwebtoken");

/*
 * the req should have the header name Authorization which must have value as 'Authorization': `Bearer ${jwtToken}`,
 */
const VerifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    //   jwt.verify(token, "secret", (err, decoded) => {
    //     if (err) {
    //       return res.status(403).json({ message: "Invalid token" });
    //     }
    //     // Token is valid, extract user information from the payload
    //     const userId = decoded.sub;
    //     // TODO: Handle the request with the extracted user information
    //   });

    console.log("--------->", process.env.SECRET_TOKEN);
    const verified = jwt.verify(token, process.env.SECRET_TOKEN);
    // .then((data) => {
    //   console.log("verified: ===> ", data);
    // })
    // .catch((err) => {
    //   console.log("error==> ", err);
    // });

    if (!verified) {
      return res.status(404).json({
        state: "FAILED",
        msg: "Invalid token against User",
      });
    }

    const user = await UserModel.findById(verified._id);
    if (!user) {
      return res.status(404).json({
        msg: "invalid user",
        state: "FAILED",
      });
    }
    console.log("verified", user);

    req.userState = verified;
    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Not able to authorized, Some Error in verification ",
    });
  }
};

module.exports = { VerifyToken };
