require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;

const redisSecurityMiddleware = require("./midlewares/SecurityMiddleware");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const sequelize = require("./config/db");
const { redisConnect } = require("./redis/client");

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
app.use(redisSecurityMiddleware);
app.use(cors(corsOptions));
app.use(apiLimiter);

//Initialize api and if ambient is development or production
//Database is synchronized
async function startApp() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync();
      console.log("Models synchronized in development environment.");
    }
    await redisConnect();
    app.listen(PORT, () => {
      console.log(`App listen in Port:${PORT} successfully!`);
    });
  } catch (error) {
    console.log("Error in initialize app:", error.message);
  }
}

//Initialize server connection
startApp();

//Test if application is running
app.get("/", (req, res) => {
  res.send("app is ok!");
});
