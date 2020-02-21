'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
const siteController = require('../controllers/siteController');

router.get('/', siteController.list);

module.exports = router;
