const {
  verifyField,
  verifyName,
  verifyEmail,
  verifyDocument,
  verifyPhone,
  verifyPassword,
} = require("../utils/verifyFields");
const Client = require("../models/ClientTable");

module.exports = userMiddleware = {
  validateNewUser: async (req, res, next) => {
    try {
      const { name, email, password, client_id } = req.body;
      const id = parseInt(client_id);
      if (isNaN(id)) {
        return res.status(400).json({
          message: "Invalid client ID",
        });
      }
      const clientExists = await Client.findByPk(id);
      if (!clientExists) {
        return res.status(404).json({
          message: "Client not found",
        });
      }
      const errorName = verifyName(name);
      const errorEmail = verifyEmail(email);
      const errorPassord = verifyPassword(password);

      const errors = [errorName, errorEmail, errorPassord].filter(
        (err) => err !== null,
      );
      if (errors.length > 0) {
        return res.status(400).json(errors[0]);
      }
      next();
    } catch (error) {
      console.error("Internal server error", error.message);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  validateId: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id || req.query.id || req.body.id);
      if (isNaN(id)) {
        return res.status(400).json({
          message: "The ID is invalid format",
        });
      }
      next();
    } catch (error) {
      console.error("Internal server error", error.message);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  validateNewUserPassword: async (req, res, next) => {
    try {
      const { email, name, newPassword, password } = req.body;

      const errorEmail = verifyEmail(email);
      const errorName = verifyName(name);
      const errorPassord = verifyPassword(password);
      const errorNewPassword = verifyField(
        newPassword,
        "newPassword",
        PASSWORD_REGEX,
        "New password is invalid",
      );

      const errors = [
        errorEmail,
        errorName,
        errorPassord,
        errorNewPassword,
      ].filter((err) => err !== null);

      if (errors.length > 0) {
        return res.status(400).json(errors[0]);
      }
      next();
    } catch (error) {
      console.error("Internal server error", error.message);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};
