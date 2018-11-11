const router = require("express").Router();
const got = require("got");

const DOCKER_SOCK = process.env.DOCKER_SOCK;

const IMAGES = `${DOCKER_SOCK}/images/json`;
const IMAGE_REMOVE = id => `${DOCKER_SOCK}/images/${id}`;

router.get("/", async (req, res) => {
  console.log(IMAGES);

  try {
    let data = await got(IMAGES);
    data = JSON.parse(data.body);

    res.send(data);
  } catch (error) {
    console.error(error);
  }
});

router.delete("/:imageId", async (req, res) => {
  console.log(IMAGE_REMOVE(req.params.imageId));

  try {
    const data = await got.delete(IMAGE_REMOVE(req.params.imageId));
    res.sendStatus(await data.statusCode);
  } catch (error) {
    res.sendStatus(error.statusCode);
    console.error("Error", error);
  }
});

module.exports = router;
