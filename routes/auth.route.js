const express = require("express");
const { register, login } = require("../controllers/auth.controller");

const router = express.Router();

//only founder adds the data
router.post("/register", register); 

//for everyone to login or logout.
router.post("/login", login);

module.exports = router;
