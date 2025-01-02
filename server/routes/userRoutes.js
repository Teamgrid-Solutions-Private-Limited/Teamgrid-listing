const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { validateCreateUser } = require('../services/validators');


router.post('/add',validateCreateUser,userController.createUser);
// Route to handle user profile update with image upload
router.put(
    "/users/:id", // Assuming user ID is provided as a URL parameter
    // Middleware to handle file upload
     // Middleware to resize the uploaded image
    userController.updateUser // Controller to handle the rest of the update logic
  );
router.get('/get/:id', userController.getUserById);
router.get('/get',userController.getAllUsers);
router.post('/delete',userController.deleteUser);

module.exports = router;