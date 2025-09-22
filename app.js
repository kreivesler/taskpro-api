require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT;

const Client = require("./models/ClientTable");
const User = require("./models/UserTable");
const Task = require("./models/TaskTable");
const sequelize = require("./config/db");

Client.hasMany(User, { foreignKey: "client_id" });
Client.hasMany(Task, { foreignKey: "client_id" });
User.hasMany(Task, { foreignKey: "user_id" });
Task.belongsTo(User, {
  foreignKey: "user_id",
});

Task.belongsTo(Client, {
  foreignKey: "client_id",
});

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

app.get("/", (req, res) => {
  res.send("app is ok!");
});
