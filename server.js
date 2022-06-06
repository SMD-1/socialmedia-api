const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = 4000;

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (err) {
    console.log(err);
  }
});

app.use("/users", require("./routes/api/user"));
app.use("/auth", require("./routes/api/auth"));
app.use("/posts", require("./routes/api/post"));
app.use("/conversations", require("./routes/api/conversation"));
app.use("/messages", require("./routes/api/message"));

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
