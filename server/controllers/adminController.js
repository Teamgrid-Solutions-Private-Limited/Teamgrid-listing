const UserService = require("../services/userService");
const Role = require("../models/roleSchema");
const Permission = require("../models/permissionSchema");
const Property = require("../models/propertySchema"); // Example model for property listings
const AppError = require("../utils/AppError"); // Custom error class

const adminController = {
  // Fetch pending property listings
  async getPendingListings(req, res, next) {
    try {
      const properties = await Property.find({ status: "pending" });
      res.status(200).json(properties);
    } catch (error) {
      next(new AppError("Failed to fetch listings", 500));
    }
  },

  // Approve or reject property listings
  async moderateListing(req, res, next) {
    const { id } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    try {
      const property = await Property.findById(id);
      if (!property) {
        return next(new AppError("Property not found", 404));
      }

      property.status = status;
      await property.save();
      res.status(200).json({ message: `Property ${status} successfully` });
    } catch (error) {
      next(new AppError("Failed to moderate listing", 500));
    }
  },

  // Fetch all users for management
  async getAllUsers(req, res, next) {
    const { limit = 10, page = 1, sort = "-createdAt", ...filters } = req.query;

    try {
      const options = {
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        sort,
      };

      const { users, total } = await UserService.getAllUsers(filters, options);

      res.status(200).json({
        data: users,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      });
    } catch (error) {
      next(new AppError("Failed to fetch users", 500));
    }
  },

  // Update user status (activate/deactivate/terminate)
  async updateUserStatus(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "terminated"].includes(status)) {
      return next(new AppError("Invalid status value", 400));
    }

    try {
      const updatedUser = await UserService.updateUser(id, { status });

      if (!updatedUser) {
        return next(new AppError("User not found", 404));
      }

      res.status(200).json({ message: `User status updated to ${status}` });
    } catch (error) {
      next(new AppError("Failed to update user status", 500));
    }
  },

  // Create a new role
  async createRole(req, res, next) {
    const { name } = req.body;

    try {
      const role = new Role({ name });
      await role.save();
      res.status(201).json({ message: "Role created successfully", role });
    } catch (error) {
      next(new AppError("Failed to create role", 500));
    }
  },

  // Assign a role to a user
  async assignRole(req, res, next) {
    const { userId, roleId } = req.body;

    try {
      const user = await UserService.findUserById(userId);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      const role = await Role.findById(roleId);
      if (!role) {
        return next(new AppError("Role not found", 404));
      }

      user.roleId = roleId;
      await user.save();

      res.status(200).json({ message: "Role assigned successfully", user });
    } catch (error) {
      next(new AppError("Failed to assign role", 500));
    }
  },

  // Create a permission
  async createPermission(req, res, next) {
    const { name } = req.body;

    try {
      const permission = new Permission({ name });
      await permission.save();
      res.status(201).json({ message: "Permission created successfully", permission });
    } catch (error) {
      next(new AppError("Failed to create permission", 500));
    }
  },

  // Assign a permission to a role
  async assignPermission(req, res, next) {
    const { roleId, permissionId } = req.body;

    try {
      const role = await Role.findById(roleId);
      if (!role) {
        return next(new AppError("Role not found", 404));
      }

      const permission = await Permission.findById(permissionId);
      if (!permission) {
        return next(new AppError("Permission not found", 404));
      }

      role.permissions = role.permissions || [];
      role.permissions.push(permissionId);
      await role.save();
      res.status(200).json({ message: "Permission assigned successfully", role });
    } catch (error) {
      next(new AppError("Failed to assign permission", 500));
    }
  },
};

module.exports = adminController;
