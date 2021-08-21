const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");
require("dotenv/config");

const app = express();
const PORT = process.env.PORT || 5000;
mongoose.connect(
  "DB_CONNECT",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => {
    console.log("Mongo DB connected");
  }
);

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.listen(PORT, () =>
  console.log(`Server Listening to http://localhost:${PORT}`)
);
