const Permission = require('../models/permissionScema');

class permissionController {
  // Create a new permission
  static createPermission = async (req, res) => {
    try {
      const { name, description } = req.body;

      
      if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
      }

      
      const permission = new Permission({ name, description });
      await permission.save();

      return res.status(201).json({ message: 'Permission created successfully', permission });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to create permission', error: error.message });
    }
  }

  // Get all permissions
  static getAllPermissions = async (req, res) => {
    try {
      const permissions = await Permission.find();
      return res.status(200).json({ message: 'Permissions retrieved successfully', permissions });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to retrieve permissions', error: error.message });
    }
  }

  // Get permission by ID
  static getPermissionById = async (req, res) => {
    const { id } = req.params;

    try {
      const permission = await Permission.findById(id);
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      return res.status(200).json({ message: 'Permission retrieved successfully', permission });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to retrieve permission', error: error.message });
    }
  }

  // Update a permission
  static updatePermission = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
      const permission = await Permission.findById(id);

      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }

    
      permission.name = name || permission.name;
      permission.description = description || permission.description;

      await permission.save();

      return res.status(200).json({ message: 'Permission updated successfully', permission });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to update permission', error: error.message });
    }
  }

  // Delete a permission
  static deletePermission = async (req, res) => {
    const { id } = req.params;

    try {
      const permission = await Permission.findByIdAndDelete(id);

      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }

      return res.status(200).json({ message: 'Permission deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to delete permission', error: error.message });
    }
  }
}

module.exports = permissionController;
