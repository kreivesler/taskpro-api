const { Sequelize } = require("sequelize");
let dbName, host, dbUser, dbPassword, dbPort, dbDialect;

dbName = toString(process.env.DBNAME);
host = toString(process.env.HOST);
dbUser = toString(process.env.DBUSER);
dbPassword = toString(process.env.DBPASSWORD);
dbPort = toString(process.env.DBPORT);
dbDialect = toString(process.env.DBDIALECT);

const connectionUri = `${dbDialect}://${dbUser}:${dbPassword}@${host}:${dbPort}/${dbName}`;

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
