const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        enum: ['normal_users', 'admin'],
        set: (value) => value.toLowerCase(), // Enforce valid role names
      },

},{timestamps:true});


module.exports = mongoose.model("roles", roleSchema);