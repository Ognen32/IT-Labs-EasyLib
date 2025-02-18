import { DataTypes } from 'sequelize';
import { sequelize } from '../database/dbConnect.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 15],
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 16],
      },
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female'),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roles: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
  }
);

User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default User;