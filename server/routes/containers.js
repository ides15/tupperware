const router = require("express").Router();
const got = require("got");

const DOCKER_SOCK = process.env.DOCKER_SOCK;

const CONTAINERS = `${DOCKER_SOCK}/containers/json?all=true&size=true`;
const CONTAINER_STOP = id => `${DOCKER_SOCK}/containers/${id}/stop`;
const CONTAINER_PRUNE = `${DOCKER_SOCK}/containers/prune`;
const CONTAINER = id =>
  `${DOCKER_SOCK}/containers/json?all=true&filters={"id":["${id}"]}`;
const CONTAINER_REMOVE = id => `${DOCKER_SOCK}/containers/${id}`;
const CONTAINER_START = id => `${DOCKER_SOCK}/containers/${id}/start`;
const CONTAINER_RESTART = id => `${DOCKER_SOCK}/containers/${id}/restart`;
const CONTAINER_RENAME = (id, name) =>
  `${DOCKER_SOCK}/containers/${id}/rename?name=${name}`;
const CONTAINER_PAUSE = id => `${DOCKER_SOCK}/containers/${id}/pause`;
const CONTAINER_UNPAUSE = id => `${DOCKER_SOCK}/containers/${id}/unpause`;
const CONTAINER_LOGS = id =>
  `${DOCKER_SOCK}/containers/${id}/logs?stdout=true&stderr=true`;

router.get("/", async (req, res) => {
  console.log(CONTAINERS);

  try {
    let data = await got(CONTAINERS);
    data = JSON.parse(data.body);

    res.send(data);
  } catch (error) {
    console.error(error);
  }
});

router.post("/stop", async (req, res) => {
  console.log(CONTAINER_STOP(req.body.containerId));

  try {
    const data = await got.post(CONTAINER_STOP(req.body.containerId));
    res.sendStatus(await data.statusCode);
  } catch (error) {
    res.sendStatus(error.statusCode);
    console.error("Error", error);
  }
});

router.post("/prune", async (req, res) => {
  console.log(CONTAINER_PRUNE);

  try {
    const data = await got.post(CONTAINER_PRUNE);
    res.send(await data.body);
  } catch (error) {
    res.sendStatus(error.statusCode);
    console.error("Error", error);
  }
});

router.get("/:containerId", async (req, res) => {
  console.log(CONTAINER(req.params.containerId));

  try {
    const data = await got(CONTAINER(req.params.containerId));
    res.send(data.body);
  } catch (error) {
    console.error(error);
  }
});

router.delete("/:containerId", async (req, res) => {
  console.log(CONTAINER_REMOVE(req.params.containerId));

  try {
    const data = await got.delete(CONTAINER_REMOVE(req.params.containerId));
    res.sendStatus(await data.statusCode);
  } catch (error) {
    res.sendStatus(error.statusCode);
    console.error("Error", error);
  }
});

router.post("/:containerId", async (req, res) => {
  console.log(CONTAINER_START(req.params.containerId));

  try {
    const data = await got.post(CONTAINER_START(req.params.containerId));
    res.sendStatus(await data.statusCode);
  } catch (error) {
    res.sendStatus(error.statusCode);
    console.error("Error", error);
  }
});

router.get("/:containerId/logs", async (req, res) => {
  console.log(CONTAINER_LOGS(req.params.containerId));

  try {
    const data = await got(CONTAINER_LOGS(req.params.containerId));

    let logs = data.body.split("\n");
    let text = [];

    logs.map(log => {
      // header parsing can go here
      text.push(`${log.substring(8)}`);
    });

    res.send(JSON.stringify(text));
  } catch (error) {
    console.error(error);
  }
});

router.post("/:containerId/restart", async (req, res) => {
  console.log(CONTAINER_RESTART(req.params.containerId));

  try {
    const data = await got.post(CONTAINER_RESTART(req.params.containerId));
    res.sendStatus(await data.statusCode);
  } catch (error) {
    res.sendStatus(error.statusCode);
    console.error("Error", error);
  }
});

router.post("/:containerId/rename", async (req, res) => {
  console.log(CONTAINER_RENAME(req.params.containerId, req.query.name));

  try {
    const data = await got.post(
      CONTAINER_RENAME(req.params.containerId, req.query.name)
    );
    res.sendStatus(await data.statusCode);
  } catch (error) {
    res.sendStatus(error.statusCode);
    console.error("Error", error);
  }
});

router.post("/:containerId/pause", async (req, res) => {
  console.log(CONTAINER_PAUSE(req.params.containerId));

  try {
    const data = await got.post(CONTAINER_PAUSE(req.params.containerId));
    res.sendStatus(await data.statusCode);
  } catch (error) {
    res.sendStatus(error.statusCode);
    console.error("Error", error);
  }
});

router.post("/:containerId/unpause", async (req, res) => {
  console.log(CONTAINER_UNPAUSE(req.params.containerId));

  try {
    const data = await got.post(CONTAINER_UNPAUSE(req.params.containerId));
    res.sendStatus(await data.statusCode);
  } catch (error) {
    res.sendStatus(error.statusCode);
    console.error("Error", error);
  }
});

module.exports = router;
