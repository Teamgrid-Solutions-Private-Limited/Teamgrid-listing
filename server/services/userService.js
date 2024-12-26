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

 // Get all users with filters, pagination, and sorting
 static async getAllUsers(filters = {}, options = {}) {
  const { limit, skip, sort } = options;

  // Build dynamic filter object for query
  const query = {};
  if (filters.firstName) {
    query.firstName = new RegExp(filters.firstName, "i"); // Case-insensitive match
  }
  if (filters.email) {
    query.email = new RegExp(filters.email, "i"); // Case-insensitive match
  }
  if (filters.phone) {
    query.phone = filters.phone; // Exact match
  }
  if (filters.roleId) {
    query.roleId = filters.roleId; // Exact match
  }

  // Fetch filtered and paginated users
  const users = await User.find(query).limit(limit).skip(skip).sort(sort);

  // Count total matching documents for pagination
  const total = await User.countDocuments(query);

  return { users, total };
}
}

module.exports = userService;
