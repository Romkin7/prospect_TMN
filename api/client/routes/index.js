"use strict";
const express = require('express');
const router = express.Router();
//const middlewareObj = require('../middleware/middlewareObj');
const indexCtrl = require('../controllers/indexCtrl');
// landingpage
router
	.route("/")
	.get(indexCtrl.getLandingPage);
// "/conditions"
module.exports = router;