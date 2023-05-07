const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_LINK)
  .then((db) => console.log("connection established"))
  .catch((err) => console.log("thrown err : " + err.message));
