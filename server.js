const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./app/models");
const Role = db.role;
//get mongourl from .env
const MONGO_URL = process.env.MONGO_URL;
const SECRET = process.env.SECRET;

const app = express();
const session = require("express-session");

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

db.mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to index test page." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "mahasiswa",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'mahasiswa' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });

      new Role({
        name: "dosen",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'dosen' to roles collection");
      });

      new Role({
        name: "departemen",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'departemen' to roles collection");
      });
    }
  });
}
