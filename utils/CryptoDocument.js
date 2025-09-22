const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = process.env.CRYPTO_KEY;
//Use first 16 character from key
const iv = Buffer.from(key.slice(0, 16));

//Encrypt text function
async function encrypt(text) {
  try {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (error) {
    console.error("Erro in encrypt:", error);
    return null;
  }
}

// Decrypt text function
async function decrypt(encryptedText) {
  try {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Erro in decrypt:", error);
    return null;
  }
}

module.exports = { encrypt, decrypt };
