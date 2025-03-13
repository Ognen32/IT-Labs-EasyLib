const userRepository = require('../repositories/userRepository');

const saveUser = async (userData) => {
  const existingUser = await userRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('Email is already in use.');
  }

  return await userRepository.createUser(userData);
};

const getAllUsers = async () => {
  return await userRepository.findAllUsers();
};

const updateUser = async (id, userData) => {
  return await userRepository.updateUser(id, userData);
};

const deleteUser = async (id) => {
  return await userRepository.deleteUser(id);
};

module.exports = {
  saveUser,
  getAllUsers,
  updateUser,
  deleteUser,
};