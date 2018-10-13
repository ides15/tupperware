const router = require("express").Router();
const got = require("got");

const DOCKER_SOCK = process.env.REACT_APP_DOCKER_SOCK;

const IMAGES = `${DOCKER_SOCK}/images/json`;

router.get("/", async (req, res) => {
  console.log(IMAGES);

  try {
    const data = await got(IMAGES);
    res.send(data.body);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
