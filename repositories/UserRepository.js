
const User = require('../models/userModel');

const createUser = async (userData) => {
  return await User.create(userData);
};

const findAllUsers = async () => {
  return await User.findAll();
};

const findUserByEmail = async (email) => {
    console.log(email); 
  return await User.findOne({ where: { email } });
};

const updateUser = async (id, userData) => {
  return await User.update(userData, { where: { id } });
};

const deleteUser = async (id) => {
  return await User.destroy({ where: { id } });
};

module.exports = {
  createUser,
  findAllUsers,
  findUserByEmail,
  updateUser,
  deleteUser,
};