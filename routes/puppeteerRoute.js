const express = require("express");
const router = express.Router();
const { postDataRequest ,getDataRequest } = require("../controllers/puppeteerController.js");

router.post("/", postDataRequest);
router.get("/", getDataRequest);

module.exports = router;
