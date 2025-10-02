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

module.exports = {
  verifyField,
  verifyName: (name) => verifyField(name, "name", NAME_REGEX, "Invalid name"),
  verifyEmail: (email) =>
    verifyField(email, "email", EMAIL_REGEX, "Invalid email"),
  verifyDocument: (document) =>
    verifyField(document, "document", DOCUMENT_REGEX, "Invalid document"),
  verifyPhone: (phone) =>
    verifyField(phone, "phone", PHONE_REGEX, "Invalid phone"),
  verifyPassword: (password) =>
    verifyField(password, "password", PASSWORD_REGEX, "Invalid password"),
};
