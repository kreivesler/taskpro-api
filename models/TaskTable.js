const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./UserTable");
const Client = require("./ClientTable");

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(155),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(["completed", "pending", "canceled"]),
      allowNull: false,
      defaultValue: "pending",
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "task",
    timestamps: false,
  }
);

Task.belongsTo(User, {
  foreignKey: "user_id",
});

Task.belongsTo(Client, {
  foreignKey: "client_id",
});

module.exports = Task;
