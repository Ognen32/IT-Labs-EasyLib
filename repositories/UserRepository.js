import User  from "../models/userModel.js";

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findAllUsers = async () => {
  return await User.findAll();
};

export const findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

export const findUserById = async (id) => {
  return await User.findByPk(id, { attributes: ["id", "username", "email"] });
};

export const updateUser = async (id, userData) => {
  return await User.update(userData, { where: { id } });
};

export const deleteUser = async (id) => {
  return await User.destroy({ where: { id } });
};