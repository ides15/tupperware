const router = require("express").Router();
const got = require("got");

const DOCKER_SOCK = process.env.DOCKER_SOCK;

const INFO = `${DOCKER_SOCK}/info`;

router.get("/", async (req, res) => {
  console.log(INFO);

  try {
    const data = await got(INFO);
    res.send(data.body);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
