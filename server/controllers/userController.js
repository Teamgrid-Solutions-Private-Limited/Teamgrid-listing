const UserService = require("../services/userService");

class UserController {
  // Create a new user
  static async createUser(req, res, next) {
    try {
      const { firstName, lastName, email, password, phone, roleId } = req.body;

      // Check if user already exists
      const existingUser = await UserService.findUserByEmail(email);
      if (existingUser) {
        // Throw a simple error object with a message and status code
        const error = { message: "Email already registered", statusCode: 409 };
        throw error;
      }

      // Create user
      const user = await UserService.createUser({
        firstName,
        lastName,
        email,
        password,
        phone,
        roleId,
      });

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      next(error); // Pass the error to the centralized error handler
    }
  }

  // Get a user by ID
  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.findUserById(id);

      if (!user) {
        // Throw error if user not found
        const error = { message: "User not found", statusCode: 404 };
        throw error;
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  // Update a user
  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const user = await UserService.updateUser(id, updates);

      if (!user) {
        // Throw error if user not found
        const error = { message: "User not found", statusCode: 404 };
        throw error;
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete a user
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.deleteUser(id);

      if (!user) {
        // Throw error if user not found
        const error = { message: "User not found", statusCode: 404 };
        throw error;
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all users
  static async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();

      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
