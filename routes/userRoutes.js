const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// POST /users - Save a new user
router.post('/users', userController.createUser);

// GET /users - Retrieve all users
router.get('/users', userController.getUsers);

module.exports = router;