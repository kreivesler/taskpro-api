const { decrypt } = require("../utils/CryptoDocument");
const Client = require("../models/ClientTable");

module.exports = clientController = {
  newClient: async (req, res) => {
    try {
      const clientExists = await Client.findAll({
        where: {
          email: req.body.email,
        },
      });

      if (clientExists.length > 0) {
        return res.status(404).json({
          message: "Client exist for this email. Try again with other email.",
        });
      }

      const client = await Client.create(req.body);

      if (!client) {
        return res.status(500).json({ message: "Error at create new client." });
      }

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

      return res.status(200).json({ message: "Client updated successfully!" });
    } catch (error) {
      console.log("internal server error", error.message);
      return res.status(500).json("Internal server error.");
    }
  },
  getClientById: async (req, res) => {
    try {
      const client = await Client.findByPk(parseInt(req.params.id));
      if (!client) {
        return res
          .status(404)
          .json({ message: "Client not found or not exist." });
      }
      return res.status(200).json({
        id: client.id,
        name: client.name,
        email: client.email,
        document: await decrypt(client.document),
        phone: client.phone,
      });
    } catch (error) {
      console.log("internal server error", error.message);
      return res.status(500).json("Internal server error.");
    }
  },
  getAllTask: async (req, res) => {
    try {
      const client = await Client.findByPk(parseInt(req.params.id));
      if (!client) {
        return res
          .status(404)
          .json({ message: "Client not found or not exist." });
      }
      const allTasks = await client.getTasks();

      return res.status(200).json(allTasks);
    } catch (error) {
      console.log("internal server error", error.message);
      return res.status(500).json("Internal server error.");
    }
  },
  getUsersByClient: async (req, res) => {
    try {
      const client = await Client.findByPk(parseInt(req.params.id));
      if (!client) {
        return res
          .status(404)
          .json({ message: "Client not found or not exist." });
      }

      const users = await client.getUsers();

      return res.status(200).json(users);
    } catch (error) {
      console.log("internal server error", error.message);
      return res.status(500).json("Internal server error.");
    }
  },
};
