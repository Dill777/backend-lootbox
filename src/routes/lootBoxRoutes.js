const express = require("express");
const router = express.Router();
const lootBoxController = require("../controllers/lootBoxController");

router.get("/", lootBoxController.getAllLootBoxes);
router.post("/open", lootBoxController.openLootBox);

module.exports = router;
