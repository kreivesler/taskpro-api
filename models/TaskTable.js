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
    hooks: {
      //hooks using before values insert in table and normalized during CREATE data
      beforeCreate: async (task) => {
        task.title = task.title.toLowerCase().trim();
        task.description = task.description.toLowerCase().trim();
        task.status = task.status.toLowerCase();
      },
    },
  }
);

module.exports = Task;
