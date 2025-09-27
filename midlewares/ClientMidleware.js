const NAME_REGEX = /^\w+(\s\w+)*$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const DOCUMENT_REGEX = /^(\d{11})|(\d{8})$/;
const PHONE_REGEX = /^(\(\d{2}\)\s?\d{5}\-?\d{4})|(\d{11})$/;
const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%&?])[A-Za-z\d@$!%*?&]{8,}$/;

const responseRegexError = (e, f, m) => {
  return {
    error: e,
    field: f,
    message: m,
  };
};

module.exports = clientMidleware = {
  validateNewClientData: async (req, res, next) => {
    try {
      const { name, email, document, phone, password } = req.body;

      if (!NAME_REGEX.test(name)) {
        return res
          .status(400)
          .json(
            responseRegexError(
              "Invalid name",
              "name",
              "The name is invalid. Not include numbers or  special characters with @$#."
            )
          );
      }
      if (!EMAIL_REGEX.test(email)) {
        return res
          .status(400)
          .json(
            responseRegexError(
              "Invalid email",
              "email",
              "Verify if the format email is correct (ex: user@exemple.com)."
            )
          );
      }
      if (!DOCUMENT_REGEX.test(document)) {
        return res
          .status(400)
          .json(
            responseRegexError(
              "Invalid document",
              "document",
              "Your document most be a CPF(11 digits) or a RG(8 digits) with only numbers."
            )
          );
      }
      if (!PHONE_REGEX.test(phone)) {
        return res
          .status(400)
          .json(
            responseRegexError(
              "Invalid phone number",
              "phone",
              "The phone number must contain 11 digits and include format (xx) 9xxxx-xxxx."
            )
          );
      }
      if (!PASSWORD_REGEX.test(password)) {
        return res
          .status(400)
          .json(
            responseRegexError(
              "Weak password",
              "password",
              "The password most be 8 characters, include a capital letter, lowercase letters and a number and one special character."
            )
          );
      }
      next();
    } catch (error) {
      console.log("Internal server error:", error.message);
      return res.status(500).json({ message: "Internal server error." });
    }
  },
};
