const express = require("express");
const { enrollInProject } = require("../controllers/intern.controller");
const { protect, isIntern } = require("../middlewares/auth.middleware");

const router = express.Router();

//project enrolling
router.post("/enroll/:projectId", protect, isIntern, enrollInProject);

module.exports = router;
