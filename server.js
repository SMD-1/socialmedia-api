const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const User = require("./model/User");
dotenv.config();

const app = express();
const PORT = 4000;

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

// middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, X-Auth-Token"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json({ extend: false }));
app.use(helmet());
app.use(morgan("common"));

app.use("/users", require("./routes/api/user"));
app.use("/auth", require("./routes/api/auth"));
app.use("/posts", require("./routes/api/post"));
app.use("/conversations", require("./routes/api/conversation"));
app.use("/messages", require("./routes/api/message"));

app.get("/allUsers", async (_, res) => {
  const allUser = await User.find({});
  res.status(200).json(allUser);
});

app.listen(PORT, () =>
  console.log(`Server Listening to http://localhost:${PORT}`)
);
