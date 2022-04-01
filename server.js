if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const fs = require("fs");
const cors = require("cors");
const app = express();
const ioServer = require("http").createServer(app);
const io = require("socket.io")(ioServer);

import { variable } from "./app/config/environment_variable";
import mongoose from "mongoose";
import Review from "./app/models/review";

const env = process.env.NODE_ENV || "development";

// allowed cross domain
// var allowCrossDomain = function(req, res, next) {
//   var allowedHost = [
//     'http://localhost',
//     'http://localhost:8000',
//     'http://localhost:3000',
//     'chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop'
//   ];
//   res.header('Access-Control-Allow-Origin', '*')
//   const postmanRequest = (typeof(req.query.json) != 'undefined') ? true : false;

//   console.log("----------------------------")
//   console.log("Origin: ", req.headers.origin);
//   console.log("Session: ", req.session);

//   if(!postmanRequest){
//     if(allowedHost.indexOf(req.headers.origin) !== -1) {
//       res.header('Cache-Control', 'no-cache');
//       res.header('Access-Control-Allow-Credentials', true);
//       res.header('Access-Control-Allow-Origin', req.headers.origin)
//       res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//       res.header('Access-Control-Allow-Headers', 'access-control-allow-credentials,access-control-allow-origin,authorization,content-type,x-xsrf-token,x_csrftoken,X-Requested-With');
//       next();
//     } else {
//       if(env != 'development') {
//         console.log("Failed the CORS origin test.");
//         res.send(401, { auth: false });
//       } else {
//         res.header('Access-Control-Allow-Origin', '*');
//         res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//         res.header('Access-Control-Allow-Headers', 'access-control-allow-credentials,access-control-allow-origin,authorization,content-type,x-xsrf-token,x_csrftoken,X-Requested-With');
//       }
//       next();
//     }
//   }
// }

app.use(cors());

app.use("/assets", express.static("./public/users"));
app.use("/output", express.static("./public/output"));

const passport = require("passport");
const rootPath = (global.rootPath = path.resolve(__dirname, "./"));
const basePath = (global.basePath = variable[env].DOMAIN);
const bearerToken = require("express-bearer-token");

app.use(
  bearerToken({
    bodyKey: "accessToken",
    queryKey: "accessToken",
    headerKey: "Bearer",
    reqKey: "token",
  })
);

const port = process.env.PORT || 3000;
const uri = "http://127.0.0.1:" + port;

// serve pure static assets
const staticPath = "/static";

app.use(staticPath, express.static("./dist/static"));

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json({ limit: "5mb" }));

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride("X-HTTP-Method-Override"));

// app.set('view engine', 'html');
// app.set('views', './dist/');

app.use(passport.initialize());
app.use(passport.session());

import authRouter from "./app/routes/auth";
import productRouter from "./app/routes/product";

app.use("/", authRouter);
app.use("/", productRouter);

io.on("connection", (socket) => {
  socket.on("rating", (data) => {
    const productId = mongoose.Types.ObjectId(data.productId);
    const score = parseFloat(data.rating);
    const review = data.review;

    const newReview = new Review();
    newReview.productId = productId;
    newReview.score = score;
    newReview.review = review;

    newReview.save(function (err) {
      if (err) {
        // error handling
      }

      socket.broadcast.emit("newRating", {
        score,
        review,
      });
    });
  });
});

const server = ioServer.listen(port);

console.log("> Listening at " + uri + "\n");
