const express = require("express");
const router = express.Router();
const machineController = require("../controllers/machineController");

router.get("", machineController.getAllMachines);
router.get("/:machine_id", machineController.getMachineById);
router.post("", machineController.createMachine);
router.put("/:machine_id", machineController.updateMachine);
router.delete("/:machine_id", machineController.deleteMachine);

module.exports = router;
