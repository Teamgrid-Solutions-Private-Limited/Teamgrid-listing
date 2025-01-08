const express = require('express');
const router = express.Router();
const PermissionController = require('../controllers/permissionController');  

// Routes
router.post('/permissions', PermissionController.createPermission);    // Create permission
router.get('/permissions', PermissionController.getAllPermissions);   // Get all permissions
router.get('/permissions/:id', PermissionController.getPermissionById);  // Get permission by ID
router.put('/permissions/:id', PermissionController.updatePermission);   // Update permission by ID
router.delete('/permissions/:id', PermissionController.deletePermission);  // Delete permission by ID

module.exports = router;
