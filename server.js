const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv/config");

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/users", require("./routes/api/user"));
app.use("/auth", require("./routes/api/auth"));
app.use("/posts", require("./routes/api/post"));

mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err == null) {
      console.log("Mongo DB connected");
    } else {
      console.log(err);
    }
  }
);

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.listen(PORT, () =>
  console.log(`Server Listening to http://localhost:${PORT}`)
);
