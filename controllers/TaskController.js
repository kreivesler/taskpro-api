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
  updateStatus: async (req, res) => {
    try {
      const id = req.body.taskId;
      const dbTask = await Task.findByPk(id);
      if (!dbTask) {
        return res.status(404).json({ message: "Task not found." });
      }

      const newStatusForTask = req.body.status;

      if (dbTask.status !== newStatusForTask) {
        await dbTask.update({ status: newStatusForTask });
      }

      await redisClient.set(`task${dbTask.id}`, JSON.stringify(dbTask));

      return res
        .status(201)
        .json({ message: "Task status updated successfully!" });
    } catch (error) {
      console.log("Internal server error:", error.message);
      return res.status(500).json({ message: "Internal server error." });
    }
  },
  getTaskById: async (req, res) => {
    try {
      const taskId = req.params.id;

      const taskCashedString = await redisClient.get(`task${taskId}`);

      let dataTask;
      if (taskCashedString) {
        dataTask = JSON.parse(taskCashedString);
      } else {
        const dbTask = await Task.findByPk(taskId);

        await redisClient.set(`task${dbTask.id}`, dbTask);

        dataTask = dbTask;
      }

      return res.status(200).json(dataTask);
    } catch (error) {
      console.log("Internal server error:", error.message);
      return res.status(500).json({ message: "Internal server error." });
    }
  },
};
