const Client = require("../models/ClientTable");
const User = require("../models/UserTable");
module.exports = taskMiddleware = {
  verifyTaskBeforeCreate: async (req, res, next) => {
    try {
      const { user_id, title, description, date, client_id } = req.body;

      const userId = isNaN(user_id);
      const clientId = isNaN(client_id);

      if (![userId, clientId].every(Boolean)) {
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
};
