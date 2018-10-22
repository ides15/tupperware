const router = require("express").Router();
const got = require("got");

const DOCKER_SOCK = process.env.DOCKER_SOCK;

const NETWORKS = `${DOCKER_SOCK}/networks`;

router.get("/", async (req, res) => {
  console.log(NETWORKS);

  try {
    const data = await got(NETWORKS);
    res.send(data.body);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
