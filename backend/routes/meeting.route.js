const express = require("express");
const router = express.Router();
const { hostMeeting, joinMeeting } = require("../controllers/meeting.controller");
const {verifyToken} = require("../middleware/auth.middle");

router.post("/host", verifyToken, hostMeeting);
router.post("/join",verifyToken,  joinMeeting);

module.exports = router;
