const { decrypt } = require("../utils/CryptoDocument");
const Client = require("../models/ClientTable");
const { redisClient } = require("../redis/clientStore");

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

      const clientStore = await Client.create(req.body);

      if (!clientStore) {
        return res
          .status(500)
          .json({ message: "Error at create new clientStore." });
      }

      await redisClient.set(
        `clientInfo${clientStore.id}`,
        JSON.stringify({
          id: clientStore.id,
          name: clientStore.name,
          email: clientStore.email,
          document: decrypt(clientStore.document),
          phone: clientStore.phone,
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
      const id = parseInt(req.params.id);
      const clientStore = await Client.findByPk(id);
      if (!clientStore) {
        return res.status(404).json({ message: "Client not found." });
      }
      await clientStore.update(req.body);

      await redisClient.set(
        `clientInfo${clientStore.id}`,
        JSON.stringify({
          id: clientStore.id,
          name: clientStore.name,
          email: clientStore.email,
          document: decrypt(clientStore.document),
          phone: clientStore.phone,
        })
      );

      return res.status(200).json({ message: "Client updated successfully!" });
    } catch (error) {
      console.log("internal server error", error.message);
      return res.status(500).json("Internal server error.");
    }
  },
  getClientById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let clientStore;

      const cachedClient = await redisClient.get(`clientInfo${id}`);

      if (cachedClient) {
        clientStore = JSON.parse(cachedClient);
      } else {
        const clientDb = await Client.findByPk(parseInt(req.params.id));

        if (!clientDb) {
          return res
            .status(404)
            .json({ message: "Client not found or not exist." });
        }

        clientStore = {
          id: clientDb.id,
          name: clientDb.name,
          email: clientDb.email,
          document: decrypt(clientDb.document),
          phone: clientDb.phone,
        };

        await redisClient.set(
          `clientInfo:${clientStore.id}`,
          JSON.stringify(clientStore)
        );
      }

      return res.status(200).json(clientStore);
    } catch (error) {
      console.log("internal server error", error.message);
      return res.status(500).json("Internal server error.");
    }
  },
  getAllTask: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let clientTasks;

      const cachedTasks = await redisClient.get(`clientTasks${id}`);

      if (cachedTasks) {
        clientTasks = JSON.parse(cachedTasks);
      } else {
        const clientDb = await Client.findByPk(id);

        if (!clientDb) {
          return res
            .status(404)
            .json({ message: "Client not found or not exist." });
        }

        clientTasks = await clientDb.getTasks();

        await redisClient.set(
          `clientTasks${clientDb.id}`,
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
      const id = parseInt(req.params.id);
      let allUsers;

      const clientCachedUsers = await redisClient.get(`clientCachedUsers${id}`);

      if (clientCachedUsers) {
        allUsers = JSON.parse(clientCachedUsers);
      } else {
        const clientDb = await Client.findByPk(id);
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
            email: u.email,
          };
        });

        await redisClient.set(
          `clientCachedUsers${parseInt(clientDb.id)}`,
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
