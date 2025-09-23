const { decrypt } = require("../utils/CryptoDocument");
const Client = require("../models/ClientTable");
const { redisClient } = require("../redis/client");

module.exports = clientController = {
  newClient: async (req, res) => {
    try {
      const clientExists = await Client.findAll({
        where: {
          email: req.body.email,
        },
      });

      if (clientExists.length > 0) {
        return res.status(400).json({
          message: "Client exist for this email. Try again with other email.",
        });
      }

      const client = await Client.create(req.body);

      if (!client) {
        return res.status(500).json({ message: "Error at create new client." });
      }

      await redisClient.set(
        `clientInfo${client.id}`,
        JSON.stringify({
          id: client.id,
          name: client.name,
          email: client.email,
          document: decrypt(client.document),
          phone: client.phone,
        })
      );
      return res.status(201).json({ message: "Client created successfully!" });
    } catch (error) {
      console.log("internal server error", error.message);
      return res.status(500).json("Internal server error.");
    }
  },
  updateClient: async (req, res) => {
    try {
      const client = await Client.findByPk(parseInt(req.params.id));
      if (!client) {
        return res.status(404).json({ message: "Client not found." });
      }
      await client.update(req.body);
      const clientStore = await redisClient.get(
        `clientInfo${parseInt(req.params.id)}`
      );

      const clientObj = JSON.parse(clientStore);
      clientObj.name = client.name;
      clientObj.email = client.email;
      clientObj.document = decrypt(client.document);
      clientObj.phone = client.phone;

      await redisClient.set(
        `clientInfo${client.id}`,
        JSON.stringify(clientObj)
      );

      return res.status(200).json({ message: "Client updated successfully!" });
    } catch (error) {
      console.log("internal server error", error.message);
      return res.status(500).json("Internal server error.");
    }
  },
  getClientById: async (req, res) => {
    try {
      let client;

      const clientStore = await redisClient.get(
        `clientInfo${parseInt(req.params.id)}`
      );

      if (clientStore) {
        client = JSON.parse(clientStore);
      } else {
        const clientDb = await Client.findByPk(parseInt(req.params.id));

        if (!clientDb) {
          return res
            .status(404)
            .json({ message: "Client not found or not exist." });
        }

        client = {
          id: clientDb.id,
          name: clientDb.name,
          email: clientDb.email,
          document: decrypt(clientDb.document),
          phone: clientDb.phone,
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
      let clientTasks;

      const taskStore = await redisClient.get(
        `clientTasks${parseInt(req.params.id)}`
      );

      if (taskStore) {
        clientTasks = JSON.parse(taskStore);
      } else {
        const clientDb = await Client.findByPk(parseInt(req.params.id));

        if (!clientDb) {
          return res
            .status(404)
            .json({ message: "Client not found or not exist." });
        }

        clientTasks = await clientDb.getTasks();

        await redisClient.set(
          `clientTasks${parseInt(clientDb.id)}`,
          JSON.stringify(clientTasks)
        );
      }

      return res.status(200).json(clientTasks);
    } catch (error) {
      console.log("internal server error", error.message);
      return res.status(500).json("Internal server error.");
    }
  },
  getUsersByClient: async (req, res) => {
    try {
      let allUsers;

      const clientUsers = await redisClient.get(
        `clientUsers${parseInt(req.params.id)}`
      );

      if (clientUsers) {
        allUsers = JSON.parse(clientUsers);
      } else {
        const clientDb = await Client.findByPk(parseInt(req.params.id));
        if (!clientDb) {
          return res
            .status(404)
            .json({ message: "Client not found or not exist." });
        }

        const users = await clientDb.getUsers();
        allUsers = users.map((u) => {
          return {
            id: u.id,
            name: u.name,
          };
        });

        await redisClient.set(
          `clientUsers${parseInt(clientDb.id)}`,
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
