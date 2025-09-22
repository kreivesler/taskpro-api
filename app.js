require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;

const rateLimit = require("express-rate-limit");
const cors = require("cors");
const sequelize = require("./config/db");

// Defined requisition limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

//Options for cors
const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(apiLimiter);

//Initialize api if ambient is development or production
if (process.env.NODE_ENV === "development") {
  sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log(`app listen in localhost:${PORT} successfully!`);
    });
  });
} else {
  app.listen(PORT, () => {
    console.log(`app listen in ${PORT} successfully!`);
  });
}

//Test if application is running
app.get("/", (req, res) => {
  res.send("app is ok!");
});
