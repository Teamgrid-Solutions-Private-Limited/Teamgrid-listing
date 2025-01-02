const Roles = require("../models/roleSchema");
const userService =require("../services/userService")
const AppError = require("../utils/appError");
const fs = require("fs-extra");
const validRoles = ["normal_users", "admin"];
const mongoose = require("mongoose")
//const jwt = require("jsonwebtoken");
 
const path =require("path")
const sharp = require("sharp");

class userController {
  // Create a new user
  static async createUser(req, res, next) {
    try {
      const { firstName, lastName, email, password, phone, roleId } = req.body;

      // Validate roleId directly in the controller
      if (!mongoose.Types.ObjectId.isValid(roleId)) {
        throw new AppError("Invalid roleId format", 400);
      }

      const role = await Roles.findById(roleId);
      if (!role || !validRoles.includes(role.roleName)) {
        throw new AppError("Role must be 'normal_users' or 'admin'", 400);
      }

      // Check if user already exists
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        throw new AppError("Email already registered", 409);
      }

      // Create the user
      const user = await userService.createUser({
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
   // Login user
   static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        throw new AppError("Email and password are required", 400);
      }

      // Check if the user exists
      const user = await userService.findUserByEmail(email);
      if (!user) {
        throw new AppError("Invalid email or password", 401);
      }

      // Verify the password
      const isPasswordValid = await user.comparePassword(password); // Assuming `comparePassword` is in the User schema
      if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, roleId: user.roleId },
        process.env.JWT_SECRET, // Ensure this is securely stored in your environment variables
        { expiresIn: "1d" } // Adjust expiration as needed
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roleId: user.roleId,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

 
  

  // Get a user by ID
  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.findUserById(id);

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
  // static async updateUser(req, res, next) {
  //   try {
  //     const { id } = req.params;
  //     const updates = req.body;

  //     const user = await userService.updateUser(id, updates);

  //     if (!user) {
  //       // Throw error if user not found
  //       const error = { message: "User not found", statusCode: 404 };
  //       throw error;
  //     }

  //     res.status(200).json({
  //       success: true,
  //       message: "User updated successfully",
  //       data: user,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  static async updateUser(req, res) {
    upload.single("profileImage")(req, res, async (err) => {
      try {
        if (err) {
          return res.status(400).json({ message: "Error uploading file: " + err.message });
        }
  
        const { email, password, currentPassword, userName, firstName, lastName, roleId, active } = req.body;
        const userId = req.params.id;
  
        if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
        }
  
        const user = await userService.findUserById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
        // Create an object to hold the data that needs to be updated
        const updatedData = {};
  
        // Only update fields that are provided
        if (email && email !== user.email) updatedData.email = email;
        if (userName) updatedData.userName = userName;
        if (firstName) updatedData.firstName = firstName;
        if (lastName) updatedData.lastName = lastName;
        if (roleId && mongoose.Types.ObjectId.isValid(roleId)) updatedData.roleId = roleId;
        if (active !== undefined) updatedData.active = active;
  
        // Handle password update if provided
        if (password) {
          if (!currentPassword) {
            return res.status(400).json({ message: "Current password is required to update password." });
          }
  
          // Validate current password
          const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
          if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid current password." });
          }
  
          // Hash the new password
          updatedData.password = await bcrypt.hash(password, 10); // Hash the new password before saving
        }
  
        // Process profile photo if uploaded
        if (req.file) {
          const profilePhotoFilename = req.file.filename;
  
          const userFolderPath = path.join(__dirname, `../my-upload/uploads/users/${userId}`);
          const smallFolderPath = path.join(userFolderPath, "small");
          const originalImagePath = path.join(userFolderPath, profilePhotoFilename);
          const smallImagePath = path.join(smallFolderPath, profilePhotoFilename);
  
          await fs.ensureDir(userFolderPath);
          await fs.ensureDir(smallFolderPath);
  
          // Move and resize the file
          await fs.move(req.file.path, originalImagePath, { overwrite: true });
          await sharp(originalImagePath).resize(80).toFile(smallImagePath);
  
          // Store only the filename or relative path in the database
          updatedData.profileImage = profilePhotoFilename;
        }
  
        // If there is no data to update, return a message
        if (Object.keys(updatedData).length === 0) {
          return res.status(400).json({ message: "No data provided for update" });
        }
  
        // Update the user with the provided data
        const updatedUser = await userService.updateUser(userId, updatedData);
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
      } catch (error) {
        console.error("Error in updateUser function:", error);
        res.status(500).json({ message: "Error updating user: " + error.message });
      }
    });
  }
  
  // Delete a user
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.deleteUser(id);

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

  static async getAllUsers(req, res, next) {
    try {
      // Extract query parameters for filtering, pagination, and sorting
      const { page = 1, limit = 10, sort = "-createdAt", ...filters } = req.query;
  
      // Parse limit and skip for pagination
      const parsedLimit = parseInt(limit, 10);
      const parsedPage = parseInt(page, 10);
      const skip = (parsedPage - 1) * parsedLimit;
  
      // Pass options and filters to the service
      const options = {
        limit: parsedLimit,
        skip,
        sort,
      };
  
      const { users, total } = await userService.getAllUsers(filters, options);
  
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
        meta: {
          currentPage: parsedPage,
          totalPages: Math.ceil(total / parsedLimit),
          total,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  
}

module.exports = userController;
