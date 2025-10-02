const NAME_REGEX = /^\w+(\s\w+)*$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const DOCUMENT_REGEX = /^(\d{11})|(\d{8})$/;
const PHONE_REGEX = /^(\(\d{2}\)\s?\d{5}\-?\d{4})|(\d{11})$/;
const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%&?])[A-Za-z\d@$!%*?&]{8,}$/;

const verifyField = (value, fieldName, regex, errorMessage) => {
  if (!regex.test(value)) {
    return {
      error: `Invalid ${fieldName}`,
      field: fieldName,
      message: errorMessage,
      status: 400,
    };
  }
  return null;
};

module.exports = clientMiddleware = {
  validateNewClientData: async (req, res, next) => {
    try {
      const { name, email, document, phone, password } = req.body;

      const errorName = verifyField(
        name,
        "name",
        NAME_REGEX,
        "The name is invalid. Do not include numbers or special characters like @, $, #.",
      );

      const errorEmail = verifyField(
        email,
        "email",
        EMAIL_REGEX,
        "Verify if the email format is correct (ex: user@exemple.com).",
      );

      const errorDocument = verifyField(
        document,
        "document",
        DOCUMENT_REGEX,
        "Verify if the document format is correct (ex: 12345678901 or 12345678).",
      );

      const errorPhone = verifyField(
        phone,
        "phone",
        PHONE_REGEX,
        "Verify if the phone format is correct (ex: (11) 98765-4321 or 11987654321).",
      );

      const errorPassword = verifyField(
        password,
        "password",
        PASSWORD_REGEX,
        "Verify if the password format is correct (ex: Password123!).",
      );

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

      const errorName = verifyField(
        name,
        "name",
        NAME_REGEX,
        "The name is invalid. Do not include numbers or special characters like @, $, #.",
      );

      const errorEmail = verifyField(
        email,
        "email",
        EMAIL_REGEX,
        "Verify if the email format is correct (ex: user@exemple.com).",
      );

      const errorPassword = verifyField(
        password,
        "password",
        PASSWORD_REGEX,
        "Verify if the password format is correct (ex: Password123!).",
      );

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
