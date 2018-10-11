const express = require("express");
const got = require("got");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

const DOCKER_SOCK = "unix:/var/run/docker.sock:";
const INFO = `${DOCKER_SOCK}/info`;

const CONTAINERS = `${DOCKER_SOCK}/containers/json?all=true`;
const CONTAINER = id =>
  `${DOCKER_SOCK}/containers/json?all=true&filters={"id":["${id}"]}`;
const CONTAINER_STOP = id => `${DOCKER_SOCK}/containers/${id}/stop`;
const CONTAINER_REMOVE = id => `${DOCKER_SOCK}/containers/${id}`;
const CONTAINER_START = id => `${DOCKER_SOCK}/containers/${id}/start`;
const CONTAINER_RESTART = id => `${DOCKER_SOCK}/containers/${id}/restart`;
const CONTAINER_RENAME = (id, name) =>
  `${DOCKER_SOCK}/containers/${id}/rename?name=${name}`;

const IMAGES = `${DOCKER_SOCK}/images/json`;

const NETWORKS = `${DOCKER_SOCK}/networks`;

const VOLUMES = `${DOCKER_SOCK}/volumes`;

app.get("/info", async (req, res) => {
  console.log(INFO);

  try {
    const data = await got(INFO);
    res.send(data.body);
  } catch (error) {
    console.error(error);
  }
});

app.get("/containers", async (req, res) => {
  console.log(CONTAINERS);

  try {
    const data = await got(CONTAINERS);
    res.send(data.body);
  } catch (error) {
    console.error(error);
  }
});

app.get("/containers/:containerId", async (req, res) => {
  console.log(CONTAINER(req.params.containerId));

  try {
    const data = await got(CONTAINER(req.params.containerId));
    console.log(data.body);
    res.send(data.body);
  } catch (error) {
    console.error(error);
  }
});

app.post("/containers/stop", async (req, res) => {
  console.log(CONTAINER_STOP(req.body.containerId));

  console.log(req.body);

  try {
    const data = await got.post(CONTAINER_STOP(req.body.containerId));
    console.log(await data.statusCode);
    res.sendStatus(await data.statusCode);
  } catch (error) {
    res.sendStatus(error.statusCode);
    console.error("Error", error);
  }
});

app.delete("/containers/:containerId", async (req, res) => {
  console.log(CONTAINER_REMOVE(req.params.containerId));

  try {
    const data = await got.delete(CONTAINER_REMOVE(req.params.containerId));
    console.log(await data.statusCode);
    res.sendStatus(await data.statusCode);
  } catch (error) {
    res.sendStatus(error.statusCode);
    console.error("Error", error);
  }
});

app.post("/containers/:containerId", async (req, res) => {
  console.log(CONTAINER_START(req.params.containerId));

  try {
    const data = await got.post(CONTAINER_START(req.params.containerId));
    console.log(await data.statusCode);
    res.sendStatus(await data.statusCode);
  } catch (error) {
    res.sendStatus(error.statusCode);
    console.error("Error", error);
  }
});

app.post("/containers/:containerId/restart", async (req, res) => {
  console.log(CONTAINER_RESTART(req.params.containerId));

  try {
    const data = await got.post(CONTAINER_RESTART(req.params.containerId));
    console.log(await data.statusCode);
    res.sendStatus(await data.statusCode);
  } catch (error) {
    res.sendStatus(error.statusCode);
    console.error("Error", error);
  }
});

app.post("/containers/:containerId/rename", async (req, res) => {
  console.log(CONTAINER_RENAME(req.params.containerId, req.query.name));

  try {
    const data = await got.post(
      CONTAINER_RENAME(req.params.containerId, req.query.name)
    );
    console.log(await data.statusCode);
    res.sendStatus(await data.statusCode);
  } catch (error) {
    res.sendStatus(error.statusCode);
    console.error("Error", error);
  }
});

app.get("/images", async (req, res) => {
  console.log(IMAGES);

  try {
    const data = await got(IMAGES);
    res.send(data.body);
  } catch (error) {
    console.error(error);
  }
});

app.get("/networks", async (req, res) => {
  console.log(NETWORKS);

  try {
    const data = await got(NETWORKS);
    res.send(data.body);
  } catch (error) {
    console.error(error);
  }
});

app.get("/volumes", async (req, res) => {
  console.log(VOLUMES);

  try {
    const data = await got(VOLUMES);
    res.send(data.body);
  } catch (error) {
    console.error(error);
  }
});

app.listen(4000);
