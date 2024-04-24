const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/users')
    .get(userController.getAllUsers)
    // Other routes for CRUD operations
router.route('/users')
    .post(userController.validateUser)

module.exports = router;
