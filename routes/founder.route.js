const express = require("express");
const { createDepartment, createProject } = require("../controllers/founder.controller");
const { protect, isFounder } = require("../middlewares/auth.middle");

const router = express.Router();


router.post("/create-department", protect, isFounder, createDepartment);
router.post("/create-project", protect, isFounder, createProject);

module.exports = router;
