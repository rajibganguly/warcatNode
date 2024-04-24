const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    email_verified_at: String,
    role_type: String,
    dep_id: String,
    phone_number: String,
    designation: String
    // Other fields
});

module.exports = mongoose.model('User', userSchema);
