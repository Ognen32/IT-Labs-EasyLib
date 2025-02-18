const userService = require('../services/userService');

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await userService.saveUser({ username, email, password });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    createUser,
    getUsers,
  };