const express = require("express");
const app = express();
const puppeteerRoute = require("./routes/puppeteerRoute.js");

app.use(express.json());

app.use("/", puppeteerRoute);

app.listen(3005, () => {
  console.log("Puppetteer Server Is Working");
});
