const express = require("express");
const router = express.Router();
const {
  createHost,
  getHostById,
  updateHost,
  deleteHost,
} = require("../hostApi");

router.post("/", createHost);
router.get("/:id", getHostById);
router.put("/:id", updateHost);
router.delete("/:id", deleteHost);

module.exports = router;
