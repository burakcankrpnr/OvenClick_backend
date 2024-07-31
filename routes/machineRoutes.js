const express = require("express");
const router = express.Router();
const machineController = require("../controllers/machineController");
const authController = require("../middleware/authMiddleware");

router.get("", authController.authenticate, machineController.getAllMachines);
router.get(
  "/:machine_id",
  authController.authenticate,
  machineController.getMachineById
);
router.post("", authController.authenticate, machineController.createMachine);
router.put(
  "/:machine_id",
  authController.authenticate,
  machineController.updateMachine
);
router.delete(
  "/:machine_id",
  authController.authenticate,
  machineController.deleteMachine
);

module.exports = router;
