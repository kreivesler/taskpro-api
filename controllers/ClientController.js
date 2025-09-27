const { decrypt } = require("../utils/CryptoDocument");
const Client = require("../models/ClientTable");
const { redisClient } = require("../redis/dbClient");
const bcrypt = require("bcrypt");

module.exports = clientController = {
  newClient: async (req, res) => {
    try {
      const dbClientExist = await Client.findAll({
        where: {
          email: req.body.email,
        },
      });

      if (dbClientExist.length > 0) {
        return res.status(400).json({
          message: "Client exist for this email. Try again with other email.",
        });
      }

      const dbClient = await Client.create(req.body);

      if (!dbClient) {
        return res
          .status(500)
          .json({ message: "Error at create new dbClient." });
      }

      await redisClient.set(
        `clientInfo${dbClient.id}`,
        JSON.stringify({
          id: dbClient.id,
          name: dbClient.name,
          email: dbClient.email,
          document: decrypt(dbClient.document),
          phone: dbClient.phone,
        })
      );
      return res.status(201).json({ message: "Client created successfully!" });
    } catch (error) {
      console.log("internal server error", error.message);
      return res.status(500).json("Internal server error.");
    }
  },
  updateClientPassword: async (req, res) => {
    try {
      const { newPassword, password, name, email } = req.body;
      const dbClient = await Client.findOne({
        where: { name: name, email: email },
      });
      if (!dbClient) {
        return res.status(404).json({ message: "Client not found." });
      }

      const isEqualPassword = await bcrypt.compare(password, dbClient.password);

      if (isEqualPassword === false) {
        return res
          .status(400)
          .json({ message: "Your old password is incorrect. Try again." });
      }
      await dbClient.update({ password: newPassword });

      await redisClient.set(
        `clientInfo${dbClient.id}`,
        JSON.stringify({
          id: dbClient.id,
          name: dbClient.name,
          email: dbClient.email,
          document: decrypt(dbClient.document),
          phone: dbClient.phone,
        })
      );

      return res.status(204).end();
    } catch (error) {
      console.log("internal server error", error.message);
      return res.status(500).json("Internal server error.");
    }
  },
  getClientById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let client;

      const cachedClient = await redisClient.get(`clientInfo${id}`);

      if (cachedClient) {
        client = JSON.parse(cachedClient);
      } else {
        const dbClient = await Client.findByPk(parseInt(req.params.id));

        if (!dbClient) {
          return res
            .status(404)
            .json({ message: "Client not found or not exist." });
        }

        client = {
          id: dbClient.id,
          name: dbClient.name,
          email: dbClient.email,
          document: decrypt(dbClient.document),
          phone: dbClient.phone,
        };

        await redisClient.set(
          `clientInfo:${client.id}`,
          JSON.stringify(client)
        );
      }

      return res.status(200).json(client);
    } catch (error) {
      console.log("internal server error", error.message);
      return res.status(500).json("Internal server error.");
    }
  },
  getAllTask: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let tasks;

      const cachedTasks = await redisClient.get(`tasks${id}`);

      if (cachedTasks) {
        tasks = JSON.parse(cachedTasks);
      } else {
        const dbClient = await Client.findByPk(id);

        if (!dbClient) {
          return res
            .status(404)
            .json({ message: "Client not found or not exist." });
        }

        tasks = await dbClient.getTasks();

        await redisClient.set(`tasks${dbClient.id}`, JSON.stringify(tasks));
      }

      return res.status(200).json(tasks);
    } catch (error) {
      console.log("internal server error", error.message);
      return res.status(500).json("Internal server error.");
    }
  },
  getUsersByClient: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let allUsers;

      const clientCachedUsers = await redisClient.get(`clientCachedUsers${id}`);

      if (clientCachedUsers) {
        allUsers = JSON.parse(clientCachedUsers);
      } else {
        const dbClient = await Client.findByPk(id);
        if (!dbClient) {
          return res
            .status(404)
            .json({ message: "Client not found or not exist." });
        }

        const users = await dbClient.getUsers();
        allUsers = users.map((u) => {
          return {
            id: u.id,
            name: u.name,
            email: u.email,
          };
        });

        await redisClient.set(
          `clientCachedUsers${parseInt(dbClient.id)}`,
          JSON.stringify(allUsers)
        );
      }

      return res.status(200).json(allUsers);
    } catch (error) {
      console.log("internal server error", error.message);
      return res.status(500).json("Internal server error.");
    }
  },
};
