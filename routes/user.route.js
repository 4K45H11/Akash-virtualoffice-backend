const {protect} = require('../middlewares/auth.middle')
const {userDashBoard} = require('../controllers/user.controller')

const express = require('express')

const router = express.Router()

router.get('/dashboard',protect,userDashBoard)

module.exports = router;
