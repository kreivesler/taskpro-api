const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcrypt");
const { encrypt } = require("../utils/CryptoDocument");

class Client extends Model {}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    document: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(15),
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "client",
    timestamps: false,
    hooks: {
      //Before create e update Client crypto document (cpf or cnpj) and password
      //Normalize email for eliminated duplicates
      beforeCreate: async (client) => {
        const salt = await bcrypt.genSalt(10);
        client.document = await encrypt(client.document);
        client.password = await bcrypt.hash(client.password, salt);
        client.name = client.name.toLowerCase().trim();
        client.email = client.email.toLowerCase().trim();
      },
      beforeUpdate: async (client) => {
        if (client.changed("document")) {
          client.document = await encrypt(client.document);
        }
        if (client.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          client.password = await bcrypt.hash(client.password, salt);
        }
        if (client.changed("name")) {
          client.name = client.name.toLowerCase().trim();
        }
        if (client.changed("email")) {
          client.email = client.email.toLowerCase().trim();
        }
      },
    },
  }
);

// Associate tables with the model
Client.associate = (models) => {
  Client.hasMany(models.User, { foreignKey: "client_id" });
  Client.hasMany(models.Task, { foreignKey: "client_id" });
};

module.exports = Client;
