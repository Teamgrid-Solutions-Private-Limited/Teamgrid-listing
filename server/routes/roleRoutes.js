// routes/roleRoutes.js
const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");

router.post("/add", roleController.createRole);
router.get("/get", roleController.getAllRoles);
router.get("/get/:id", roleController.getRoleById);
router.put("/updatee/:id", roleController.updateRole);
router.delete("/:id", roleController.deleteRole);

module.exports = router;
