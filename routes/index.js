let express = require("express");
let router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.send("Not Found");
});

module.exports = router;
