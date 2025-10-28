const Client = require("../models/ClientTable");
const User = require("../models/UserTable");
const { redisClient } = require("../redis/client");

module.exports = taskMiddleware = {
  verifyTaskBeforeCreate: async (req, res, next) => {
    try {
      const { user_id, title, description, date, client_id } = req.body;

      if (isNuN(user_id) || isNaN(client_id)) {
        return res
          .status(400)
          .json({ message: "Client ID or user ID not a number." });
      }

      const dbClient = await Client.findByPk(client_id);
      if (!dbClient) {
        return res.status(404).json({ message: "Client not found." });
      }

      const dbUser = await User.findByPk(user_id);
      if (!dbUser) {
        return res.status(404).json({ message: "User not found." });
      }

      if (![title, description, date].every(Boolean)) {
        return res.status(400).json({ message: "Task info not declared" });
      }

      next();
    } catch (error) {
      console.error("Internal server error", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  verifyTaskBeforeUpdateStatus: async (req, res, next) => {
    try {
      const id = req.body.id;
      const newStatusTask = req.body.status;
      const statusBase = ["pending", "confirmed", "canceled"];

      if (isNaN(id)) {
        return res.status(400).json({ message: "This ID is invalid." });
      }

      const taskExists = await redisClient.get(`task${id}`);

      if (!taskExists) {
        return res.status(400).json({ message: "The task not found." });
      }

      if (!statusBase.includes(newStatusTask)) {
        return res
          .status(400)
          .json({ message: "The status declared is incorrect." });
      }

      next();
    } catch (error) {
      console.error("Internal server error", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  verifyTaskExistById: async (req, res, next) => {
    try {
      const id = req.params.id || req.body.id;

      if (isNaN(id)) {
        return res.status(400).json({ message: "This ID is invalid." });
      }

      const taskExists = await redisClient.get(`task${id}`);

      if (!taskExists) {
        return res.status(400).json({ message: "The task not found." });
      }

      next();
    } catch (error) {
      console.error("Internal server error", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
