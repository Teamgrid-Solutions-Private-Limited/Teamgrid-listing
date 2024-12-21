// services/UserService.js
const User = require("../models/userSchema");

class UserService {
  // Create a new user
  static async createUser(data) {
    return await User.create(data);
  }

  // Find user by ID
  static async findUserById(id) {
    return await User.findById(id);
  }

  // Update user
  static async updateUser(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  // Delete user
  static async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  // Get all users
  static async getAllUsers(filter = {}) {
    return await User.find(filter);
  }
}

module.exports = UserService;
