const { check, validationResult } = require("express-validator");

// Validation for creating a user
const validateCreateUser = [
  check("firstName").notEmpty().withMessage("First name is required"),
  check("lastName").notEmpty().withMessage("Last name is required"),
  check("email").isEmail().withMessage("Invalid email address"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  check("phone")
    .isMobilePhone()
    .withMessage("Invalid phone number format"),
  check("roleId")
    .isIn(["normal_users", "admin"])
    .withMessage("Role must be 'normal_users' or 'admin'"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateCreateUser };
