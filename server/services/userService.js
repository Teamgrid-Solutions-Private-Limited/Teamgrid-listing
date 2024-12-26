// services/UserService.js
const User = require("../models/userSchema");

class userService {
  // Create a new user
  static async createUser(data) {
    return await User.create(data);
  }

  // Find user by ID
  static async findUserById(id) {
    return await User.findById(id);
  }

  // Find user by email
  static async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  static async updateUser(id, data) {
    // Find the user by ID and update the profile image or any other fields
    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
    return updatedUser;
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

module.exports = userService;
