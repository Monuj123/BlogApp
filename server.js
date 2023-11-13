const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const blogRouter = require("./routes/blog-routes");
const app = express();
app.use(express.json());
app.use("/api/user", router);
app.use("/api/blog", blogRouter);

mongoose
  .connect(
    "mongodb+srv://gogoimonuj007:test123@cluster0.xvcgmft.mongodb.net/Blog?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000);
  })
  .then(() => {
    console.log("Connected to DB and Port is 3000");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res, next) => {
  res.send("<h1>HELLO</h1>");
});
