const { decrypt } = require("../utils/CryptoDocument");
const User = require("../models/UserTable");
const { redisClient } = require("../redis/client");

module.exports = userController = {
  newUser: async (req, res) => {
    try {
      const user = await User.findOne({ where: { email: req.body.email } });

      if (user) {
        return res.status(400).json({
          message: "User exist for this email. Try again with a new email.",
        });
      }

      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        client_id: req.body.client_id,
      });

      if (!newUser) {
        return res.status(500).json({ message: "Internal server error" });
      }

      await redisClient.set(
        `userInfo${parseInt(newUser.id)}`,
        JSON.stringify({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          client_id: newUser.client_id,
        })
      );

      return res
        .status(201)
        .json({ message: "New user created successfully!" });
    } catch (error) {
      console.log("Internal server error:", error.message);
      return res.status(500).json({ message: "Internal server error." });
    }
  },
  getUserById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let user;

      const cachedUser = await redisClient.get(`userInfo${id}`);

      if (cachedUser) {
        user = JSON.parse(cachedUser);
      } else {
        userStore = await User.findByPk(id);

        if (!userStore) {
          return res.status(404).json({ message: "User not found." });
        }

        user = {
          id: userStore.id,
          name: userStore.name,
          email: userStore.email,
          client_id: userStore.client_id,
        };

        await redisClient.set(`userInfo${userStore.id}`, JSON.stringify(user));
      }

      return res.status(200).json(user);
    } catch (error) {
      console.log("Internal server error:", error.message);
      return res.status(500).json({ message: "Internal server error." });
    }
  },
};
