const { Sequelize } = require("sequelize");
let dbName, host, dbUser, dbPassword, dbPort, dbDialect;

dbName = process.env.DBNAME;
host = process.env.HOST;
dbUser = process.env.DBUSER;
dbPassword = process.env.DBPASSWORD;
dbPort = process.env.DBPORT;
dbDialect = process.env.DBDIALECT;

const connectionUri = `${dbDialect}://${dbUser}:${dbPassword}@${host}:${dbPort}/${dbName}`;

console.log("Uri DB:", connectionUri);

const sequelize = new Sequelize(connectionUri);

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
