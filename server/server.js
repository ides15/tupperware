const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

process.env.REACT_APP_DOCKER_SOCK = "unix:/var/run/docker.sock:";

const info = require("./routes/info");
const containers = require("./routes/containers");
const images = require("./routes/images");
const networks = require("./routes/networks");
const volumes = require("./routes/volumes");

app.use("/info", info);
app.use("/containers", containers);
app.use("/images", images);
app.use("/networks", networks);
app.use("/volumes", volumes);

app.listen(4000, () => console.log("Serving on *4000..."));
