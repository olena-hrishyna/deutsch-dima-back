const express = require("express");
const mongoose = require("mongoose");
const http = require("http");

const { urlBD } = require("./config");
const PORT = process.env.PORT || 3000;

const authRouter = require("./routers/authRouter");
const wordsRouter = require("./routers/wordsRouter");
const audioRouter = require("./routers/audioRouter");
const trainingRouter = require("./routers/trainingRouter");


const app = express();

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, HEAD, OPTIONS, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use("/auth", authRouter);
app.use("/words", wordsRouter);
app.use("/audio", audioRouter);
app.use("/training", trainingRouter);

const server = http.createServer(app);

const start = async () => {
  try {
    await mongoose.connect(urlBD);
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
