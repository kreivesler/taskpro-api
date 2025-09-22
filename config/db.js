// Exemplo de como a conexão poderia ser envolta em uma função
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  database: process.env.DBNAME,
  host: process.env.HOST,
  username: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT,
  dialect: "mysql",
});

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

connectToDatabase();

module.exports = sequelize;
