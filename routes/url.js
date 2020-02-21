var express = require('express');
var router = express.Router()

const siteController = require('../controllers/siteController');

/* GET site page. */
router.get('/:page', siteController.pagination);

module.exports = router;
