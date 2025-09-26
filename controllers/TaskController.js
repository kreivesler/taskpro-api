const Task = require("../models/TaskTable");
const { redisClient } = require("../redis/client");

module.exports = taskController = {
  newTask: async (req, res) => {
    try {
      const dbTask = await Task.create(req.body);

      if (!dbTask) {
        return res.status(500).json({ message: "Internal server error." });
      }

      await redisClient.set(`task${dbTask.id}`, JSON.stringify(dbTask));

      return res
        .status(201)
        .json({ message: "New task created successfully!" });
    } catch (error) {
      console.log("Internal server error:", error.message);
      return res.status(500).json({ message: "Internal server error." });
    }
  },
};
