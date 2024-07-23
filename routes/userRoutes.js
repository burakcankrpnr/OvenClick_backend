const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/usercontroller");

router.get("/", usercontroller.getAllUser);
router.get("/:user_id", usercontroller.getUserById);
router.post("/", usercontroller.createUser);
router.delete("/:user_id", usercontroller.deleteUser);
router.put("/:user_id", usercontroller.updateUser);

module.exports = router;
