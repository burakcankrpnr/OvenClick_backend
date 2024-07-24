const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/userController");
const authController = require("../middleware/authMiddleware");

router.get("/", authController.authenticate, usercontroller.getAllUser);
router.get("/:user_id", usercontroller.getUserById);
router.post("/", usercontroller.createUser);
router.delete("/:user_id", usercontroller.deleteUser);
router.put("/:user_id", usercontroller.updateUser);

module.exports = router;
