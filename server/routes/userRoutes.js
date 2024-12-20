const express = require('express');

const router = express.Router();

const { userAdd, updateUser, getUserById, getAllUsers, deleteUser } = require('../controllers/userController');

router.post('/add', userAdd);
router.put('/update', updateUser);
router.get('/get/:id', getUserById);
router.get('/get', getAllUsers);
router.post('/delete', deleteUser);

module.exports = router;