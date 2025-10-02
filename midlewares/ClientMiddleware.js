const {
  verifyField,
  verifyName,
  verifyEmail,
  verifyDocument,
  verifyPhone,
  verifyPassword,
} = require("../utils/verifyFields");

module.exports = clientMiddleware = {
  validateNewClientData: async (req, res, next) => {
    try {
      const { name, email, document, phone, password } = req.body;

      const errorName = verifyName(name);

      const errorEmail = verifyEmail(email);

      const errorDocument = verifyDocument(document);

      const errorPhone = verifyPhone(phone);

      const errorPassword = verifyPassword(password);

      const errors = [
        errorName,
        errorEmail,
        errorDocument,
        errorPhone,
        errorPassword,
      ].filter((err) => err !== null);

      if (errors.length > 0) {
        return res.status(400).json(errors[0]);
      }

      next();
    } catch (error) {
      console.log("Internal server error:", error.message);
      return res.status(500).json({ message: "Internal server error." });
    }
  },
  validateUpdateClientPassword: async (req, res, next) => {
    try {
      const { email, password, newPassword } = req.body;

      const errorEmail = verifyEmail(email);

      const errorPassword = verifyPassword(password);

      const errorNewPassword = verifyField(
        newPassword,
        "newPassword",
        PASSWORD_REGEX,
        "Verify if the new password format is correct (ex: Password123!).",
      );

      const errors = [errorEmail, errorPassword, errorNewPassword].filter(
        (err) => err !== null,
      );

      if (errors.length > 0) {
        return res.status(400).json(errors[0]);
      }

      next();
    } catch (error) {
      console.log("Internal server error:", error.message);
      return res.status(500).json({ message: "Internal server error." });
    }
  },
};
