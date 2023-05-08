const express = require("express");
const dotenv = require("dotenv");
const routes = require("./Routes/router");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config({ path: "./.env" });

try {
  require("./Controller/ConnectionDB");
} catch (err) {
  console.log("the error occured at establishing the connection ", err);
}

console.log(process.env.PORT);

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json({ limit: "15mb" }));
app.use(express.json());

// app.use(
//   cors({
//     origin:"",
//     credentials: true,
//     methods: ["PUT", "GET", "POST", "PATCH", "DELETE"],
//   })
// );

app.use(routes);

// listening port
app.listen(process.env.PORT || 5000, (error) => {
  if (error) {
    console.log(`failed to listen because ${error}`);
  } else {
    console.log(`listening at ${process.env.PORT}`);
  }
});
