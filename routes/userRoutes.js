const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/userController");
const authController = require("../middleware/authMiddleware");

router.get("/", authController.authenticate, usercontroller.getAllUser);
router.get(
  "/:user_id",
  authController.authenticate,
  usercontroller.getUserById
);
router.post("/", authController.authenticate, usercontroller.createUser);
router.delete(
  "/:user_id",
  authController.authenticate,
  usercontroller.deleteUser
);
router.put("/:user_id", authController.authenticate, usercontroller.updateUser);

module.exports = router;
