const express = require("express");
const path = require("path");
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

app.use("/api/info", info);
app.use("/api/containers", containers);
app.use("/api/images", images);
app.use("/api/networks", networks);
app.use("/api/volumes", volumes);

app.use(express.static(path.join(__dirname, "../build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(8888, () => console.log("Serving on *8888..."));
