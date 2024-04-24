const User = require('../models/userModel');

/**
 * @description: Get user call for admin
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};


/**
 * @description: Post user call
 * @param {*} req 
 * @param {*} res 
 */
exports.validateUser = async (req, res) => {
    const currentUsers = new User(req.body);
    try {
        await currentUsers.save();
        res.status(200).json({
            status: 'success',
            data: currentUsers
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Other controller functions for CRUD operations
