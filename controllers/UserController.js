const User = require("../models/UserTable");
const { redisClient } = require("../redis/client");
const bcrypt = require("bcrypt");

module.exports = userController = {
  newUser: async (req, res) => {
    try {
      const dbUser = await User.findAll({ where: { email: req.body.email } });

      if (dbUser.length > 0) {
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
        dbUser = await User.findByPk(id);

        if (!dbUser) {
          return res.status(404).json({ message: "User not found." });
        }

        user = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          client_id: dbUser.client_id,
        };

        await redisClient.set(`userInfo${user.id}`, JSON.stringify(user));
      }

      return res.status(200).json(user);
    } catch (error) {
      console.log("Internal server error:", error.message);
      return res.status(500).json({ message: "Internal server error." });
    }
  },
  updateUserPassword: async (req, res) => {
    try {
      const { email, name, newPassword, password } = req.body;
      const dbUser = await User.findOne({
        where: { email: email, name: name },
      });
      if (!dbUser) {
        return res.status(404).json({ message: "User not found." });
      }

      const isEqualPassword = await bcrypt.compare(password, dbUser.password);

      if (isEqualPassword === false) {
        return res
          .status(400)
          .json({ message: "Your old password is incorrect. Try again." });
      }

      await dbUser.update({
        password: newPassword,
      });

      await redisClient.set(
        `userInfo${dbUser.id}`,
        JSON.stringify({
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          client_id: dbUser.client_id,
        })
      );

      return res.status(204).end();
    } catch (error) {
      console.log("Internal server error:", error.message);
      return res.status(500).json({ message: "Internal server error." });
    }
  },
};
