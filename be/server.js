"use strict";

var fs = require("fs");
var http = require("http");
var https = require("https");
var path = require("path");
var _ = require("lodash");
var Q = require("q");
var cors = require("cors");
var multer = require("multer");
var express = require("express");
var bodyParser = require("body-parser");
var mailParser = require("./mailparser/mail.parser").parser;
var socketServer = require("./socket").server;
var config = require("./utils/config").config;
var log = require("./utils/log").log;

if (process.argv[2]) {
  config.db = process.argv[2];
}
if (process.argv[3]) {
  config.port = process.argv[3];
}

var db = require("./services/session").session;
// var agenda = require('./routines/agenda');

var utils = require("./utils/utils.js").utils;

var internalRoutes = require("./routes/internal").routes;
var whatsappRoute = require("./whatsapp/routes/routes");

var uploadService = require("./services/upload");
var services = require("./services/services").service;

var app;
var openHttpConnections = {};
var httpServer;
var port = config.port;

process.on("uncaughtException", function (err) {
  console.error("Uncaught exception ", err);
  shutdown();
});

process.on("SIGTERM", function () {
  console.log("Received SIGTERM");
  shutdown();
});

process.on("SIGINT", function () {
  console.log("Received SIGINT");
  shutdown();
});

Q.try(function () {
  return db.init();
})
  .then(function () {
    log.write("All Databases got initialised ... !!");
    initialiseServer();
    services.initServices();
    // initialiseAgenda();
  })
  .catch(function (e) {
    log.write("Exception in intialising servers :: ", e);
  });

var initialiseServer = function () {
  try {
    app = express();
    app.use(
      cors({
        origin: function (origin, callback) {
          return callback(null, true);
        },
        optionsSuccessStatus: 200,
        credentials: true,
      })
    );
    app.disable("etag");
    app.use(bodyParser.text());
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ extended: true, limit: "50mb", parameterLimit:50000}));
    app.use(function (req, res, next) {
      // res.setHeader("Access-Control-Allow-Origin", config.domainUrl);
      // res.setHeader("Access-Control-Allow-Origin", "http://t.coworkops.in");
      // res.setHeader("Access-Control-Allow-Origin", "http://nerp.hustlehub.xyz");
      // res.setHeader("Access-Control-Allow-Origin", "http://localhost");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", true);
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, content-type, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, companyId, timezone, username"
      );
      next();
    });

    app.get("/", function (req, res) {
      res.send("Welcome to LetsWork Backend Server .. !!");
    });
    app.use("/" + config.apiVersion + "/internal/admin", internalRoutes.admin);
    app.use(
      "/" + config.apiVersion + "/internal/accounts",
      internalRoutes.accounts
    );
    app.use(
      "/" + config.apiVersion + "/internal/bookings",
      internalRoutes.bookings
    );
    app.use("/" + config.apiVersion + "/internal/leads", internalRoutes.leads);
    app.use(
      "/" + config.apiVersion + "/internal/support",
      internalRoutes.support
    );
    app.use(
      "/" + config.apiVersion + "/internal/selfcare",
      internalRoutes.selfcare
    );
    app.use("/" + config.apiVersion + "/internal/pg", internalRoutes.pgs);
    app.use(
      "/" + config.apiVersion + "/internal/visits",
      internalRoutes.visits
    );
    app.use(
      "/" + config.apiVersion + "/internal/purchases",
      internalRoutes.purchases
    );
    app.use(
      "/" + config.apiVersion + "/internal/reports",
      internalRoutes.reports
    );
    app.use(
      "/" + config.apiVersion + "/internal/assets",
      internalRoutes.assets
    );
    app.use(
      "/" + config.apiVersion + "/internal/dashboards",
      internalRoutes.dashboards
    );
    app.use("/" + config.apiVersion + "/client", internalRoutes.client);

    app.use("/" + config.apiVersion + "/whatsapp", whatsappRoute);

    app.post("/" + config.apiVersion + "/upload", function (req, res) {
      uploadService(req, function (err, data) {
        if (err) {
          return res.status(500).end(JSON.stringify(err));
        }
        res.send(data);
      });
    });

    app.post(
      "/" + config.apiVersion + "/statusImageUploads/:id",
      function (req, res) {
        uploadService(req, function (err, data) {
          if (err) {
            return res.status(500).end(JSON.stringify(err));
          }
          log.write(
            "Server ::: statusImageUploads :: statusId : " + req.params.id
          );
          services.addStatusImage({
            vendorPurchaseItemStatusId: req.params.id,
            imageId: data.id,
            updated: new Date(),
            updatedBy: utils.getUserName(req),
          });
          res.send(data);
        });
      }
    );

    app.post(
      "/" + config.apiVersion + "/resourceImageUploads/:id",
      function (req, res) {
        uploadService(req, function (err, data) {
          if (err) {
            return res.status(500).end(JSON.stringify(err));
          }
          log.write(
            "Server ::: resourceImageUploads :: resource : " + req.params.id
          );
          services.addResourceImage({
            resourceId: req.params.id,
            imageId: data.id,
            updated: new Date(),
            updatedBy: utils.getUserName(req),
          });
          res.send(data);
        });
      }
    );

    app.get("/download/:filename", (req, res) => {
      const path = __dirname + "/resources/" + req.params.filename;
        if (fs.existsSync(path)) {
          //res.contentType("application/pdf");
          fs.createReadStream(path).pipe(res)
      } else {
          res.status(500)
          console.log('File not found')
          res.send('File not found')
      }
      // res.download(
      //     filePath, 
      //     "downloaded-book.png", // Remember to include file extension
      //     (err) => {
      //         if (err) {
      //             res.send({
      //                 error : err,
      //                 msg   : "Problem downloading the file"
      //             })
      //         }
      // });
  });

    app.post(
      "/" + config.apiVersion + "/buildingImageUploads/:id",
      function (req, res) {
        uploadService(req, function (err, data) {
          if (err) {
            return res.status(500).end(JSON.stringify(err));
          }
          log.write(
            "Server ::: buildingImageUploads :: buildingId : " + req.params.id
          );
          services.addBuildingImage({
            buildingId: req.params.id,
            imageId: data.id,
            updated: new Date(),
            updatedBy: utils.getUserName(req),
          });
          res.send(data);
        });
      }
    );

    app.post(
      "/" + config.apiVersion + "/propertyImageUploads/:id",
      function (req, res) {
        uploadService(req, function (err, data) {
          if (err) {
            return res.status(500).end(JSON.stringify(err));
          }
          log.write(
            "Server ::: propertyImageUploads :: propertyId : " + req.params.id
          );
          services.addPropertyImage({
            propertyId: req.params.id,
            imageId: data.id,
            updated: new Date(),
            updatedBy: utils.getUserName(req),
          });
          res.send(data);
        });
      }
    );

    if (!config.hasSSL) {
      httpServer = http.Server(app);

      httpServer.listen(port, function () {
        log.write("Server started at " + port + " port ...!!!!!!!!!!");
      });
    } else {
      var options = {
        key: fs.readFileSync("/var/www/ssls/private.key"),
        cert: fs.readFileSync("/var/www/ssls/certificate.crt"),
        ca: fs.readFileSync("/var/www/ssls/ca_bundle.crt"),
      };

      httpServer = https.createServer(options, app);
      httpServer.listen(port, function () {
        log.write("SSL Server started at " + port + " port ...!!!!!!!!!!");
      });
    }

    httpServer.on("connection", function (conn) {
      var key = conn.remoteAddress + ":" + (conn.remotePort || "");

      openHttpConnections[key] = conn;

      conn.on("close", function () {
        delete openHttpConnections[key];
      });
    });

    var filesDir = path.join(path.dirname(require.main.filename), "uploads");
    var logsDir = path.join(path.dirname(require.main.filename), "logs");

    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir);
      fs.mkdirSync(logsDir);
    }

    socketServer.connect(httpServer);
  } catch (e) {
    console.log("Exception in initializing server", e);
  }
};

var shutdown = function () {
  console.log("Shutting down");
  console.log("Closing web server");

  Q.try(function () {
    return [db.close(), servicesDB.close()];
  }).spread(function () {
    log.write("All Databases got closed ... !!");
  });
  httpServer.close(function () {
    console.log("Web server closed");
  });

  for (var key in openHttpConnections) {
    openHttpConnections[key].destroy();
  }
};
/////////// Postmioan collecton Creation Sample code May not requited lates //////

var Collection = require('postman-collection').Collection,
	myCollection;

// Load a collection to memory from a JSON file on disk (say, sample-collection.json)
myCollection = new Collection(JSON.parse(fs.readFileSync('collection.json').toString()));

// log items at root level of the collection
console.log(myCollection.toJSON());





// const { Collection, Item, Header } = require('postman-collection');


// // This is the our postman collection
// const postmanCollection = new Collection({
//   info: {
//     // Name of the collection
//     name: 'Sample Postman collection'
//   },
//   // Requests in this collection
//   item: [],
// });

// // This string will be parsed to create header
// const rawHeaderString =
//   'Authorization:\nContent-Type:application/json\ncache-control:no-cache\n';

// // Parsing string to postman compatible format
// const rawHeaders = Header.parse(rawHeaderString);

// // Generate headers
// const requestHeader = rawHeaders.map((h) => new Header(h));

// // API endpoint
// const apiEndpoint = 'https://httpbin.org/post';

// // Name of the request
// const requestName = 'Sample request name';

// // Request body
// const requestPayload = {
//   key1: 'value1',
//   key2: 'value2',
//   key3: 'value3'
// };

// // Add tests for request
// const requestTests = `
// pm.test('Sample test: Test for successful response', function() {
//   pm.expect(pm.response.code).to.equal(200);
// });
// `

// // Create the final request
// const postmanRequest = new Item({
//   name: `${requestName}`,
//   request: {
//     header: requestHeader,
//     url: apiEndpoint,
//     method: 'POST',
//     body: {
//       mode: 'raw',
//       raw: JSON.stringify(requestPayload),
//     },
//     auth: null,
//   },
//   event: [
//     {
//       listen: 'test',
//       script: {
//         type: 'text/javascript',
//         exec: requestTests,
//       },
//     },
//   ],
// });


// log.write("\n\n\n\n COLLECTION--1", postmanRequest)


// // Add the reqest to our empty collection
// postmanCollection.items.add(postmanRequest);

// // Convert the collection to JSON 
// // so that it can be exported to a file
// const collectionJSON = postmanCollection.toJSON();
// log.write("\n\n\n\n COLLECTION", collectionJSON)
// // // Create a colleciton.json file. It can be imported to postman
// // fs.writeFile('./collection.json', JSON.stringify(collectionJSON), (err) => {
// //   if (err) { console.log(err); }
// //   console.log('File saved');
// // });



/////////// Postmioan collecton Creation Sample code May not requited lates //////
var initialiseAgenda = function () {
  agenda.on("ready", async () => {
    agenda.start();
    log.write(
      "Server ::: initialiseAgenda :: started .. !! at ",
      utils.moment()
    );
    // agenda.now('raise invoices', { bookingId: 1 });
    // agenda.schedule(utils.moment().add(10, 'seconds').toDate(), 'raise invoices', { bookingId: 1 });

    var job = await agenda.every("10 minutes", "raise invoices", {
      bookingId: 1,
    });
    log.write("Server ::: initialiseAgenda :: job : ", job);
  });
};
